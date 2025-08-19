import { Controller, Get, HttpException, HttpStatus, Query } from '@nestjs/common';
import { TranslateService } from './translate.service';
import { ApiQuery, ApiOperation, ApiTags, ApiBearerAuth, ApiOkResponse, ApiServiceUnavailableResponse } from '@nestjs/swagger';
import { Language } from 'generated/prisma';
import { AutocompleteResponse } from './dto/autocomplete-response.dto';

@ApiTags('Translation')
@ApiBearerAuth('access-token')
@Controller('translate')
export class TranslateController {
  constructor(private readonly translateService: TranslateService) {}

  @Get('info')
  @ApiOperation({ summary: 'отримання інформації про слово' })
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

  @Get()
  @ApiOperation({ summary: 'Переклад слова' })
  @ApiQuery({ name: 'text', type: String })
  @ApiQuery({ name: 'from', enum: Language, required: true })
  @ApiQuery({ name: 'to', enum: Language, required: true })
  async getTranslate(
    @Query('text') text: string,
    @Query('from') from: Language,
    @Query('to') to: Language,
  ) {
    return this.translateService.translateText(text, from, to);
  }

  @Get('suggestions')
  @ApiOperation({
    summary: 'Отримуйте пропозиції автозаповнення',
    description: 'Повертає пропозиції автозаповнення на основі наданого запиту. Використовує API Datamuse для пропозицій або повертає порожній масив для коротких запитів.',
  })
  @ApiQuery({
    name: 'query',
    description: 'Пошуковий запит для автозаповнення (мінімум 2 символи)',
    example: 'hel',
    required: true,
  })
  @ApiOkResponse({
    description: 'Пропозиції автозаповнення успішно отримано',
    type: AutocompleteResponse,
    examples: {
      'api-response': {
        summary: 'Відповідь API',
        value: {
          suggestions: ['hello', 'help', 'helmet', 'helicopter'],
          source: 'api',
          query: 'hel',
        },
      },
      'short-query': {
        summary: 'Короткий запит',
        value: {
          suggestions: [],
          source: 'local',
          query: 'h',
        },
      },
      'api-error': {
        summary: 'API Error Fallback',
        value: {
          suggestions: [],
          source: 'local',
          query: 'hel',
        },
      },
    },
  })
  async getSuggestions(@Query('query') query: string): Promise<AutocompleteResponse> {
    if (!query) {
      throw new HttpException('Query parameter is required', HttpStatus.BAD_REQUEST);
    }

    return this.translateService.getSuggestions(query);
  }

  @Get('words/starting-with')
  @ApiOperation({
    summary: 'Знайдіть слова, що починаються на "query"',
    description: 'Повертає слова, що починаються з наданого запиту, використовуючи пошук за шаблоном API Datamuse.',
  })
  @ApiQuery({
    name: 'query',
    description: 'Префікс для пошуку слів, що починаються з',
    example: 'cat',
    required: true,
  })
  @ApiOkResponse({
    description: 'Слова, що починаються з "query", успішно отримано',
    type: [String],
    examples: {
      'success': {
        summary: 'Successful Response',
        value: ['cat', 'category', 'catalog', 'catch', 'cathedral'],
      },
    },
  })
  @ApiServiceUnavailableResponse({
    description: 'Не вдалося отримати suggestions з API Datamuse',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Failed to fetch suggestions from Datamuse API',
        },
        statusCode: {
          type: 'number',
          example: 503,
        },
      },
    },
  })
  async getWordsStartingWith(@Query('query') query: string): Promise<string[]> {
    if (!query) {
      throw new HttpException('Query parameter is required', HttpStatus.BAD_REQUEST);
    }

    return this.translateService.getWordsStartingWith(query);
  }

  @Get('words/related')
  @ApiOperation({
    summary: "Отримати пов'язані слова",
    description: "Повертає слова, семантично пов'язані з наданим запитом, використовуючи API Datamuse.",
  })
  @ApiQuery({
    name: 'query',
    description: 'Слово для пошуку споріднених слів',
    example: 'happy',
    required: true,
  })
  @ApiOkResponse({
    description: "Пов'язані слова успішно отримано",
    type: [String],
    examples: {
      'success': {
        summary: 'Successful Response',
        value: ['joy', 'cheerful', 'content', 'pleased', 'delighted'],
      },
      'no-results': {
        summary: 'No Results Found',
        value: [],
      },
    },
  })
  async getRelatedWords(@Query('query') query: string): Promise<string[]> {
    if (!query) {
      throw new HttpException('Query parameter is required', HttpStatus.BAD_REQUEST);
    }

    return this.translateService.getRelatedWords(query);
  }
}
