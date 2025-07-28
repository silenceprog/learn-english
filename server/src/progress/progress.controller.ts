import { Controller, Get, Query, ParseIntPipe, Param, HttpStatus, HttpException, ParseEnumPipe, Body, ValidationPipe, Post } from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { GetCurrentUserId } from 'src/decorators/get-current-user-id.decorator';
import { ProgressService } from './progress.service';
import { CEFRLevel, CoreSkillType, Language } from 'generated/prisma';
import { UpdateSkillProgressDto } from './dto/update-skill-progress.dto';

interface LearningRecommendation {
  type: 'FOCUS_SKILL' | 'REVIEW_CARDS';
  skillType?: CoreSkillType;
  count?: number;
  message: string;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
}

interface LearningRecommendationsResponse {
  overallLevel?: CEFRLevel;
  message?: string;
  recommendations: LearningRecommendation[];
}

class SkillProgressResponse {
  id: number;
  userId: number;
  skillType: CoreSkillType;
  cefrLevel: CEFRLevel;
  levelProgress: number;
  totalPracticed: number;
  totalAnswers: number;
  correctAnswers: number;
  currentAccuracy: number;
  xpEarned: number;
  timeSpent: number;
  totalWordsStudied: number;
  wordsLearned: number;
  lastPracticed: Date;
  createdAt: Date;
  updatedAt: Date;
}

@ApiTags('progress')
@ApiBearerAuth()
@Controller('progress')
export class ProgressController {
  constructor(private readonly progressService: ProgressService) {}

 @Post(':language/skills/:skillType/update')
  @ApiOperation({ 
    summary: 'Update skill progress',
    description: 'Updates progress for a specific skill after practice session'
  })
  @ApiParam({ 
    name: 'language', 
    enum: Language,
    description: 'Language being practiced'
  })
  @ApiParam({ 
    name: 'skillType', 
    enum: CoreSkillType,
    description: 'Type of skill being practiced'
  })
  @ApiBody({ type: UpdateSkillProgressDto })
  @ApiResponse({ 
    status: 200, 
    description: 'Skill progress updated successfully',
    type: SkillProgressResponse
  })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async updateSkillProgress(
    @GetCurrentUserId() userId: number,
    @Param('language', new ParseEnumPipe(Language)) language: Language,
    @Param('skillType', new ParseEnumPipe(CoreSkillType)) skillType: CoreSkillType,
    @Body(ValidationPipe) updateData: UpdateSkillProgressDto
  ) {
    try {
      const result = await this.progressService.updateSkillProgress(
        userId,
        language,
        skillType,
        updateData
      );

      return {
        success: true,
        message: 'Skill progress updated successfully',
        data: result
      };
    } catch (error) {
      throw new HttpException(
        'Failed to update skill progress',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get(':language')
  @ApiOperation({ 
    summary: 'Get language progress',
    description: 'Retrieves detailed progress information for a specific language'
  })
  @ApiParam({ 
    name: 'language', 
    enum: Language,
    description: 'Language to get progress for'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Language progress retrieved successfully'
  })
  @ApiResponse({ status: 404, description: 'Language progress not found' })
  async getLanguageProgress(
     @GetCurrentUserId() userId: number,
    @Param('language', new ParseEnumPipe(Language)) language: Language
  ) {
    const progress = await this.progressService.getLanguageProgress(userId, language);
    
    if (!progress) {
      throw new HttpException(
        'Language progress not found. Start learning to create progress.',
        HttpStatus.NOT_FOUND
      );
    }

    return {
      success: true,
      data: progress
    };
  }

  @Get(':language/leaderboard')
  @ApiOperation({ 
    summary: 'Get language leaderboard',
    description: 'Retrieves top learners for a specific language'
  })
  @ApiParam({ 
    name: 'language', 
    enum: Language,
    description: 'Language to get leaderboard for'
  })
  @ApiQuery({ 
    name: 'limit', 
    required: false, 
    type: Number,
    description: 'Number of top users to return (1-100, default: 10)'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Leaderboard retrieved successfully'
  })
  async getLanguageLeaderboard(
    @Param('language', new ParseEnumPipe(Language)) language: Language,
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number
  ) {
    const leaderboard = await this.progressService.getLanguageLeaderboard(
      language, 
      limit || 10
    );

    return {
      success: true,
      data: {
        language,
        totalUsers: leaderboard.length,
        leaderboard
      }
    };
  }

  @Get(':language/recommendations')
  @ApiOperation({ 
    summary: 'Get learning recommendations',
    description: 'Provides personalized learning recommendations based on current progress'
  })
  @ApiParam({ 
    name: 'language', 
    enum: Language,
    description: 'Language to get recommendations for'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Recommendations retrieved successfully'
  })
  async getLearningRecommendations(
     @GetCurrentUserId() userId: number,
    @Param('language', new ParseEnumPipe(Language)) language: Language
  ): Promise<{ success: boolean; data: LearningRecommendationsResponse }> {
    const recommendations = await this.progressService.getLearningRecommendations(
      userId, 
      language
    );

    return {
      success: true,
      data: recommendations
    };
  }

  @Get('overview')
  @ApiOperation({ 
    summary: 'Get user progress overview',
    description: 'Retrieves overall progress summary across all languages'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Progress overview retrieved successfully'
  })
  async getProgressOverview( @GetCurrentUserId() userId: number) {
    try {
      // Отримуємо прогрес по всіх мовах
      const languages = Object.values(Language);
      const progressPromises = languages.map(language => 
        this.progressService.getLanguageProgress(userId, language)
      );
      
      const progressResults = await Promise.all(progressPromises);
      const activeLanguages = progressResults
        .map((progress, index) => progress ? { 
          languageCode: languages[index],
          ...progress 
        } : null)
        .filter(progress => progress !== null);

      // Розраховуємо загальну статистику
      const totalXP = activeLanguages.reduce((sum, lang) => sum + (lang.totalXP || 0), 0);
      const totalTime = activeLanguages.reduce((sum, lang) => sum + (lang.totalTime || 0), 0);
      
      // Знаходимо найактивнішу мову
      const mostActiveLanguage = activeLanguages.reduce((prev, current) => 
        (current.totalXP > prev.totalXP) ? current : prev, 
        activeLanguages[0] || null
      );

      return {
        success: true,
        data: {
          summary: {
            totalLanguages: activeLanguages.length,
            totalXP,
            totalTimeSpent: totalTime,
            mostActiveLanguage: mostActiveLanguage?.languageCode || null
          },
          languages: activeLanguages.map(lang => ({
            language: lang.languageCode,
            overallCEFR: lang.overallCEFR,
            overallProgress: lang.overallProgress,
            totalXP: lang.totalXP,
            totalTime: lang.totalTime,
            lastActiveAt: lang.lastActiveAt,
            skillsCount: lang.skillBreakdown?.length || 0
          }))
        }
      };
    } catch (error) {
      throw new HttpException(
        'Failed to retrieve progress overview',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}