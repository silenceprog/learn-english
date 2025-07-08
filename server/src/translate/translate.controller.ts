import { Controller, Get, Query } from '@nestjs/common';
import { TranslateService } from './translate.service';
import { ApiQuery, ApiOperation, ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { Language } from 'generated/prisma';

@ApiTags('Translation')
@ApiBearerAuth('access-token')
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
    @Query('to') to: Language,
  ) {
    return this.translateService.wordTranslate(text, from, to);
  }

  @Get('time')
  getTime() {
    return { time: Date.now() };
  }
}
