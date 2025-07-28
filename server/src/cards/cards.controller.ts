import { Controller, Post, Get, Body, Param, Query } from '@nestjs/common';
import { FlashCardService } from './cards.service';
import { ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth('access-token')
@Controller('flashcards')
export class FlashcardController {
  constructor(private readonly flashcardService: FlashCardService) {}

  
}