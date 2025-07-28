import { Controller, Post, Get, Body, Param, Query } from '@nestjs/common';
import { FlashCardService } from './cards.service';
import { GetFlashcardsDto } from './dto/flashcard.dto';
import { CreateFlashcardDto} from './dto/create-card.dto';
import {FlashcardAnswerDto} from './dto/flashcard-answer.dto';
import { GetCurrentUserId } from 'src/decorators/get-current-user-id.decorator';

@Controller('flashcards')
export class FlashcardController {
  constructor(private readonly flashcardService: FlashCardService) {}

  @Get()
  async getFlashcards(
    @GetCurrentUserId() userId: number,
    @Query() query: GetFlashcardsDto
  ) {
    return this.flashcardService.getFlashcardsForUser(userId, query);
  }

  @Get('review')
  async getReviewCards(@GetCurrentUserId() userId: number) {
    return this.flashcardService.getCardsForReview(userId);
  }

  @Post('answer')
  async submitAnswer(
    @GetCurrentUserId() userId: number,
    @Body() answerDto: FlashcardAnswerDto
  ) {
    return this.flashcardService.processAnswer(userId, answerDto);
  }

  @Post('create')
  async createFlashcard(
    @GetCurrentUserId() userId: number,
    @Body() createDto: CreateFlashcardDto
  ) {
    return this.flashcardService.createFlashcard(userId, createDto);
  }

  @Get('stats/:language')
  async getStats(
    @GetCurrentUserId() userId: number,
    @Param('language') language: string
  ) {
    return this.flashcardService.getUserStats(userId, language);
  }
}