import { Controller, Get, Query } from '@nestjs/common';
import { TranslateService } from './translate.service';
import { Language } from './enums/language.enum';
import { ApiQuery, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Translation')
@Controller('translate')
export class TranslateController {
  constructor(private readonly translateService: TranslateService) {}

  @Get()
  @ApiOperation({ summary: 'Переклад слова та отримання визначення' })
  @ApiQuery({ name: 'text', type: String })
  @ApiQuery({ name: 'from', enum: Language, required: true })
  @ApiQuery({ name: 'to', enum: Language, required: true })
  async getTranslation(
    @Query('text') text: string,
    @Query('from') from: Language,
    @Query('to') to: Language
  ) {
    return this.translateService.wordTranslate(text, from, to);
  }
}