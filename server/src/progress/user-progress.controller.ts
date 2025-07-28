import { Controller, Get, Query, ParseIntPipe } from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiQuery,
} from '@nestjs/swagger';
import { GetCurrentUserId } from 'src/decorators/get-current-user-id.decorator';
import { UserProgressService } from './user-progress.service';

@ApiTags('words-stats')
@ApiBearerAuth()
@Controller('words/stats')
export class UserProgressController {
  constructor(private readonly userProgressService: UserProgressService) {}

  @ApiOperation({ summary: 'Отримати загальну статистику слів користувача' })
  @ApiResponse({ status: 200, description: 'Статистика слів' })
  @Get('overview')
  async getWordsOverview(@GetCurrentUserId() userId: number) {
    return this.userProgressService.getWordsOverview(userId);
  }

  @ApiOperation({ summary: 'Отримати статистику прогресу по днях' })
  @ApiResponse({ status: 200, description: 'Денна статистика' })
  @ApiQuery({
    name: 'days',
    required: false,
    description: 'Кількість днів (за замовчуванням 30)',
  })
  @Get('daily')
  async getDailyProgress(
    @GetCurrentUserId() userId: number,
    @Query('days', ParseIntPipe) days: number = 30,
  ) {
    return this.userProgressService.getDailyProgress(userId, days);
  }

  @ApiOperation({ summary: 'Отримати статистику по частинам мови' })
  @ApiResponse({ status: 200, description: 'Статистика частин мови' })
  @Get('parts-of-speech')
  async getPartsOfSpeechStats(@GetCurrentUserId() userId: number) {
    return this.userProgressService.getPartsOfSpeechStats(userId);
  }

  @ApiOperation({ summary: 'Отримати статистику складності слів' })
  @ApiResponse({ status: 200, description: 'Статистика складності' })
  @Get('difficulty')
  async getDifficultyStats(@GetCurrentUserId() userId: number) {
    return this.userProgressService.getDifficultyStats(userId);
  }

  @ApiOperation({ summary: 'Отримати топ найскладніших слів' })
  @ApiResponse({ status: 200, description: 'Список найскладніших слів' })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Кількість слів (за замовчуванням 10)',
  })
  @Get('difficult')
  async getMostDifficultWords(
    @GetCurrentUserId() userId: number,
    @Query('limit', ParseIntPipe) limit: number = 10,
  ) {
    return this.userProgressService.getMostDifficultWords(userId, limit);
  }

  @ApiOperation({ summary: 'Отримати рекомендації для вивчення' })
  @ApiResponse({ status: 200, description: 'Рекомендовані слова' })
  @Get('recommendations')
  async getStudyRecommendations(@GetCurrentUserId() userId: number) {
    return this.userProgressService.getStudyRecommendations(userId);
  }

  @ApiOperation({ summary: 'Отримати статистику досягнень' })
  @ApiResponse({ status: 200, description: 'Статистика досягнень у словнику' })
  @Get('achievements')
  async getVocabularyAchievements(@GetCurrentUserId() userId: number) {
    return this.userProgressService.getVocabularyAchievements(userId);
  }

  @ApiOperation({ summary: 'Отримати графік вивчення слів' })
  @ApiResponse({ status: 200, description: 'Дані для графіку' })
  @ApiQuery({
    name: 'period',
    required: false,
    description: 'Період: week, month, year',
  })
  @Get('chart')
  async getLearningChart(
    @GetCurrentUserId() userId: number,
    @Query('period') period: string = 'month',
  ) {
    return this.userProgressService.getLearningChart(userId, period);
  }
}
