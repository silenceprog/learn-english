import { Controller, Post, Get, Body, Param, Query, HttpException, HttpStatus, ParseIntPipe } from '@nestjs/common';
import { FlashCardService } from './cards.service';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
} from '@nestjs/swagger';
import { FlashcardAnswerDto } from './dto/flashcard-answer.dto';
import { FlashcardQueryDto } from './dto/flashcard-query.dto';
import { GetCurrentUserId } from 'src/decorators/get-current-user-id.decorator';
import { FlashcardResponseDto } from './dto/flashcard-response.dto';
import { Language, TaskType } from 'generated/prisma';

@ApiBearerAuth('access-token')
@Controller('flashcards')
export class FlashcardController {
  constructor(private readonly flashCardService: FlashCardService) {}

  @Get()
  @ApiOperation({
    summary: 'Отримати слова для флешкарт',
    description:
      'Отримує список слів для вивчення або повторення залежно від параметрів',
  })
  @ApiResponse({
    status: 200,
    description: 'Список карточок',
    type: [FlashcardResponseDto],
  })
  @ApiQuery({ name: 'language', enum: Language, required: false })
  @ApiQuery({ name: 'taskType', enum: TaskType, required: false })
  @ApiQuery({ name: 'limit', type: Number, required: false })
  @ApiQuery({ name: 'reviewOnly', type: Boolean, required: false })
  @ApiQuery({ name: 'level', required: false })
  async getFlashcards(
    @GetCurrentUserId() userId: any,
    @Query() query: FlashcardQueryDto,
  ): Promise<FlashcardResponseDto[]> {
    try {
    return this.flashCardService.getTaskWords(userId, query);
    }
    catch (error) {
      throw new HttpException(
        'Помилка при отриманні флешкарт',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

 @Post('check-answer')
  @ApiOperation({ 
    summary: 'Перевірити відповідь',
    description: 'Перевіряє правильність відповіді користувача та оновлює прогрес' 
  })
  @ApiResponse({
    status: 200,
    description: 'Результат перевірки відповіді',
    schema: {
      properties: {
        isCorrect: { type: 'boolean' },
        score: { type: 'number' },
        correctAnswer: { 
          oneOf: [
            { type: 'string' },
            { type: 'array', items: { type: 'string' } }
          ]
        },
        explanation: { type: 'string', nullable: true },
        nextReviewAt: { type: 'string', format: 'date-time', nullable: true },
        taskType: { enum: Object.values(TaskType) },
        progress: {
          type: 'object',
          properties: {
            attempts: { type: 'number' },
            correctCount: { type: 'number' },
            accuracy: { type: 'number' },
          },
        },
      },
    },
  })
  async checkAnswer(
    @GetCurrentUserId() userId,
    @Body() answer: FlashcardAnswerDto,
  ) {
    try {
      return await this.flashCardService.checkAnswer(userId, answer);
    } catch (error) {
      if (error.status === 404) {
        throw error;
      }
      throw new HttpException(
        'Помилка при перевірці відповіді',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

 
  @Get('stats')
  @ApiOperation({ 
    summary: 'Отримати статистику флешкарт',
    description: 'Повертає загальну статистику вивчення слів та прогрес' 
  })
  @ApiResponse({
    status: 200,
    description: 'Статистика флешкарт',
  })
  @ApiQuery({ name: 'language', enum: Language, required: false })
  @ApiQuery({ name: 'taskType', enum: TaskType, required: false })
  async getStats(
    @GetCurrentUserId() userId,
    @Query('language') language?: Language,
    @Query('taskType') taskType?: TaskType,
  ) {
    try {
      return await this.flashCardService.getFlashcardStats(userId, language, taskType);
    } catch (error) {
      throw new HttpException(
        'Помилка при отриманні статистики',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('review')
  @ApiOperation({ 
    summary: 'Отримати слова для повторення',
    description: 'Повертає слова, які потрібно повторити згідно з алгоритмом інтервального повторення' 
  })
  @ApiResponse({
    status: 200,
    description: 'Слова для повторення',
    type: [FlashcardResponseDto],
  })
  @ApiQuery({ name: 'taskType', enum: TaskType, required: false })
  @ApiQuery({ name: 'limit', type: Number, required: false })
  async getWordsForReview(
   @GetCurrentUserId() userId: any,
    @Query('taskType') taskType: TaskType = TaskType.FLASHCARDS,
    @Query('limit', new ParseIntPipe({ optional: true })) limit: number = 20,
  ) {
    try {
      return await this.flashCardService.getWordsForReview(userId, taskType, limit);
    } catch (error) {
      throw new HttpException(
        'Помилка при отриманні слів для повторення',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('practice')
  @ApiOperation({ 
    summary: 'Отримати слова для практики',
    description: 'Повертає слова, які потребують додаткової практики (не пройдені завдання)' 
  })
  @ApiResponse({
    status: 200,
    description: 'Слова для практики',
    schema: {
      type: 'array',
      items: {
        allOf: [
          { $ref: '#/components/schemas/FlashcardResponseDto' },
          {
            properties: {
              progress: { $ref: '#/components/schemas/WordProgressDto' },
            },
          },
        ],
      },
    },
  })
  @ApiQuery({ name: 'taskType', enum: TaskType, required: false })
  @ApiQuery({ name: 'limit', type: Number, required: false })
  async getWordsNeedingPractice(
    @GetCurrentUserId() userId: any,
    @Query('taskType') taskType: TaskType = TaskType.FLASHCARDS,
    @Query('limit', new ParseIntPipe({ optional: true })) limit: number = 20,
  ) {
    try {
      return await this.flashCardService.getWordsNeedingPractice(userId, taskType, limit);
    } catch (error) {
      throw new HttpException(
        'Помилка при отриманні слів для практики',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('types')
  @ApiOperation({ 
    summary: 'Отримати доступні типи завдань',
    description: 'Повертає список всіх доступних типів завдань для флешкарт' 
  })
  @ApiResponse({
    status: 200,
    description: 'Типи завдань',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          value: { type: 'string', enum: Object.values(TaskType) },
          label: { type: 'string' },
          description: { type: 'string' },
        },
      },
    },
  })
  async getTaskTypes() {
    const taskTypes = [
      {
        value: TaskType.FLASHCARDS,
        label: 'Флешкарти',
        description: 'Переклад з рідної мови на іноземну',
      },
      {
        value: TaskType.REVERSE_FLASHCARDS,
        label: 'Зворотні флешкарти',
        description: 'Переклад з іноземної мови на рідну',
      },
      {
        value: TaskType.MATCHING,
        label: 'Співставлення',
        description: 'Знайти відповідність між словом та перекладом',
      },
      {
        value: TaskType.FILL_IN_THE_BLANK,
        label: 'Заповнення пропусків',
        description: 'Вставити правильне слово в речення',
      },
    ];

    return taskTypes;
  }
}
