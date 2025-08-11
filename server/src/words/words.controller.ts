import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  Req,
  Query,
  ValidationPipe,
} from '@nestjs/common';
import { WordsService } from './words.service';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreateWordDto } from './dto/create-word.dto';
import { UpdateWordDTO } from './dto/update-word.dto';
import { WordEntity } from './dto/word.entity';
import { PaginationDto } from './dto/pagination.dto';
import { UpdateProgressDto } from './dto/update-progress';
import { GetCurrentUserId } from 'src/decorators/get-current-user-id.decorator';
import { ProgressService } from 'src/progress/progress.service';
import { CoreSkillType } from 'generated/prisma';
import { MarkWordsLearnedDto } from './dto/mark-word.dto';

@ApiTags('Words')
@ApiBearerAuth('access-token')
@Controller('words')
export class WordsController {
  constructor(
    private readonly wordsService: WordsService,
  ) {}

  @ApiOperation({ summary: 'Створення слова' })
  @ApiResponse({
    status: 201,
    type: CreateWordDto,
    description: 'Слово успішно створено',
  })
  @ApiResponse({ status: 409, description: 'Слово вже існує' })
  @Post()
  async createWord(
    @GetCurrentUserId() userId,
    @Body(ValidationPipe) createWordDTO: CreateWordDto,
  ) {
    return this.wordsService.createWord(userId, createWordDTO);
  }

  @ApiOperation({ summary: 'Отримання слів побуквено' })
  @ApiResponse({
    status: 200,
    type: WordEntity,
    description: 'Список знайдених слів',
  })
  @Get('search')
  searchWords(@GetCurrentUserId() userId, @Query('q') query: string) {
    return this.wordsService.searchWords(userId, query);
  }

  @ApiOperation({ summary: 'Отримати слова користувача з пагінацією' })
  @ApiResponse({ status: 200, description: 'Список слів користувача' })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Поточна сторінка',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Кількість значень на одну сторінку',
  })
  @ApiQuery({
    name: 'type',
    required: false,
    type: String,
    description: 'Тип значення',
  })
  @Get('by-language')
  @ApiOperation({
    summary: 'Отримати слова за поточними налаштуваннями мови користувача',
  })
  getWordsByUser(
    @GetCurrentUserId() userId,
    @Query() paginationDto: PaginationDto,
  ) {
    return this.wordsService.getWordsByUserLanguage(userId, paginationDto);
  }

  @ApiOperation({ summary: 'Отримати слова для повторення' })
  @ApiResponse({ status: 200, description: 'Список слів для повторення' })
  @Get('review')
  async getWordsForReview(
    @GetCurrentUserId() userId: number,
    @Param('taskType') taskType: CoreSkillType,
    @Query('limit', ParseIntPipe) limit: number = 10,
  ) {
    return this.wordsService.getWordsForReview(userId, taskType, limit);
  }

  @ApiOperation({ summary: 'Зміна прогреса після виконання завдання' })
  @Patch(':wordId/:taskType')
  async completeTask(
    @Param('wordId', ParseIntPipe) wordId: number,
    @GetCurrentUserId() userId,
    @Body(ValidationPipe) progressData: UpdateProgressDto,
  ) {
    return this.wordsService.updateWordProgress(userId, wordId, progressData);
  }

  @ApiOperation({ summary: 'Отримання слова по айді' })
  @ApiResponse({ status: 200, type: WordEntity, description: 'Деталі слова' })
  @ApiResponse({ status: 404, description: 'Слово не знайдено' })
  @Get(':id')
  findById(@Param('id', ParseIntPipe) id: number) {
    return this.wordsService.findById(id);
  }

  @ApiOperation({ summary: 'Оновлення інформації про слово' })
  @ApiResponse({
    status: 200,
    type: UpdateWordDTO,
    description: 'Слово успішно оновлено',
  })
  @ApiResponse({
    status: 404,
    description: 'Слово не знайдено або немає доступу',
  })
  @Patch(':id')
  updateWord(
    @Param('id', ParseIntPipe) id: number,
    @GetCurrentUserId() userId,
    @Body() updateWordDTO: UpdateWordDTO,
  ) {
    return this.wordsService.updateWord(id, userId, updateWordDTO);
  }

 @Post('mark-batch-learned')
  @ApiOperation({ summary: 'Позначити множину слів як вивчених' })
  @ApiResponse({ status: 200, description: 'Слова успішно оброблені' })
  async markWordsLearned(
    @GetCurrentUserId() userId: number,
    @Body(ValidationPipe) requestData: MarkWordsLearnedDto,
  ) {
    return this.wordsService.markWordsLearned(
      userId, 
      requestData.wordIds, 
      requestData.progressData
    );
  }

  @ApiOperation({ summary: 'Видалення слова' })
  @ApiResponse({ status: 200, description: 'Слово успішно видалено' })
  @ApiResponse({
    status: 404,
    description: 'Слово не знайдено або немає доступу',
  })
  @Delete(':id')
  deleteWord(
    @GetCurrentUserId() userId,
    @Param('id', ParseIntPipe) wordId: number,
  ) {
    return this.wordsService.deleteUserWord(userId, wordId);
  }
}
