import { Injectable, BadRequestException } from '@nestjs/common';
import { ProgressService } from '../progress/progress.service';
import { GetFlashcardsDto } from './dto/flashcard.dto';
import { CreateFlashcardDto} from './dto/create-card.dto';
import {FlashcardAnswerDto} from './dto/flashcard-answer.dto';
import { Language } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';
import { CEFRLevel, MasteryLevel } from 'generated/prisma';

@Injectable()
export class FlashCardService {
  constructor(
    private databaseService: DatabaseService,
    private progressService: ProgressService,
  ) {}

 
}