import { Module } from '@nestjs/common';
import { WordsController } from './words.controller';
import { WordsService } from './words.service';
import { DatabaseModule } from 'src/database/database.module';
import { TranslateService } from 'src/translate/translate.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports:[DatabaseModule,HttpModule],
  controllers: [WordsController],
  providers: [WordsService, TranslateService]
})
export class WordsModule {}
