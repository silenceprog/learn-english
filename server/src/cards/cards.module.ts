import { Module } from '@nestjs/common';
import {  FlashCardService } from './cards.service';
import { FlashcardController } from './cards.controller';
import { DatabaseModule } from 'src/database/database.module';
import { DatabaseService } from 'src/database/database.service';
import { ProgressService } from 'src/progress/progress.service';

@Module({
  imports:[DatabaseModule],
  controllers: [FlashcardController],
  providers: [FlashCardService,ProgressService],
})
export class CardsModule {}
