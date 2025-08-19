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
    summary: 'Оновити прогрес у навичках',
    description: 'Оновлює прогрес для певної навички після тренування'
  })
  @ApiParam({ 
    name: 'language', 
    enum: Language,
    description: 'Мова, що практикується'
  })
  @ApiParam({ 
    name: 'skillType', 
    enum: CoreSkillType,
    description: 'Тип навичок, що практикуються'
  })
  @ApiBody({ type: UpdateSkillProgressDto })
  @ApiResponse({ 
    status: 200, 
    description: 'Прогрес у навичці успішно оновлено',
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
        message: 'Прогрес у навичці успішно оновлено',
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
    summary: 'Отримати прогрес по мові',
    description: 'Отримати детальну інформацію про прогрес для певної мови'
  })
  @ApiParam({ 
    name: 'language', 
    enum: Language,
    description: 'Мова, для якої потрібно отримати прогрес'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Прогрес по мові успішно отримано'
  })
  @ApiResponse({ status: 404, description: 'Прогресу в мовленні не знайдено' })
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

  @Get(':language/recommendations')
  @ApiOperation({ 
    summary: 'Отримати навчальні рекомендації',
    description: 'Надає персоналізовані рекомендації щодо навчання на основі поточного прогресу'
  })
  @ApiParam({ 
    name: 'language', 
    enum: Language,
    description: 'Мова, для якої потрібно отримувати рекомендації'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Рекомендації успішно отримано'
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
    summary: 'Отримати прогрес користувача',
    description: 'Отримати загальний прогрес по всім мовам'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Прогрес успішно отримано'
  })
  async getProgressOverview( @GetCurrentUserId() userId: number) {
    try {
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

      const totalXP = activeLanguages.reduce((sum, lang) => sum + (lang.totalXP || 0), 0);
      const totalTime = activeLanguages.reduce((sum, lang) => sum + (lang.totalTime || 0), 0);
      
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