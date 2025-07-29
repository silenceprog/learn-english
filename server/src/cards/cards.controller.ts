import { Controller, Post, Get, Body, Param, Query } from '@nestjs/common';
import { FlashCardService } from './cards.service';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { FlashcardAnswerDto } from './dto/flashcard-answer.dto';
import { FlashcardQueryDto } from './dto/flashcard-query.dto';
import { GetCurrentUserId } from 'src/decorators/get-current-user-id.decorator';
import { FlashcardResponseDto } from './dto/flashcard-response.dto';
import { Language } from 'generated/prisma';

@ApiBearerAuth('access-token')
@Controller('flashcards')
export class FlashcardController {
  constructor(private readonly flashcardService: FlashCardService) {}

  @Get()
  @ApiOperation({ summary: 'Отримати карточки для вивчення' })
  @ApiResponse({
    status: 200,
    description: 'Список карточок',
    type: [FlashcardResponseDto],
  })
  async getFlashcards(
    @GetCurrentUserId() userId: any,
    @Query() query: FlashcardQueryDto,
  ): Promise<FlashcardResponseDto[]> {
    return this.flashcardService.getFlashcards(userId, query);
  }

  @Post('check')
  @ApiOperation({ summary: 'Перевірити відповідь на карточку' })
  @ApiResponse({ status: 200, description: 'Результат перевірки' })
  async checkAnswer(
    @GetCurrentUserId() userId: any,
    @Body() answer: FlashcardAnswerDto,
  ) {
    return this.flashcardService.checkAnswer(userId, answer);
  }

  @Get('stats')
  @ApiOperation({ summary: 'Отримати статистику карточок' })
  @ApiResponse({ status: 200, description: 'Статистика карточок' })
  async getStats(
    @GetCurrentUserId() userId: any,
    @Query('language') language?: Language,
  ) {
    return this.flashcardService.getFlashcardStats(userId, language);
  }

  @Get('review')
  @ApiOperation({ summary: 'Отримати слова для повторення' })
  @ApiResponse({ status: 200, description: 'Слова для повторення' })
  async getWordsForReview(
    @GetCurrentUserId() userId: any,
    @Query('limit') limit?: number,
  ) {
    return this.flashcardService.getWordsForReview(userId, limit);
  }
}
