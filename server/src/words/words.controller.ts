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
} from '@nestjs/common';
import { WordsService } from './words.service';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreateWordDto } from './dto/create-word.dto';
import { UpdateWordDTO } from './dto/update-word.dto';
import { WordEntity } from './dto/word.entity';
import { Language } from 'generated/prisma';

@ApiTags('Words')
@ApiBearerAuth('access-token')
@Controller('words')
export class WordsController {
  constructor(private readonly wordsService: WordsService) {}

  @ApiOperation({ summary: 'Створення слова' })
  @ApiResponse({ status: 201, type: CreateWordDto })
  @Post()
  createWord(@Body() createWordDTO: CreateWordDto) {
    return this.wordsService.createWord(createWordDTO);
  }

  @ApiOperation({ summary: 'Отримання всіх слів' })
  @ApiResponse({ status: 200, type: WordEntity })
  @Get()
  findAll() {
    return this.wordsService.findAll();
  }

  @ApiOperation({ summary: 'Отримання слова по айді' })
  @ApiResponse({ status: 200, type: WordEntity })
  @Get(':id')
  findById(@Param('id', ParseIntPipe) id: number) {
    return this.wordsService.findById(id);
  }

  @ApiOperation({ summary: 'Отримати слова за мовою' })
  @Get('by-language/:lang')
  getByLanguage(@Param('lang') lang: Language,@Req() req) {
    const userId = req.user.id;
    return this.wordsService.getWordsByLanguage(userId,lang);
  }

  @Get('by-language/:lang')
  @ApiOperation({
    summary: 'Отримати слова за поточними налаштуваннями мови користувача',
  })
  getWordsByUser(@Req() req) {
    const userId = req.user.id;
    return this.wordsService.getWordsByUserLanguage(userId);
  }

  @ApiOperation({ summary: 'Оновлення інформації про слово' })
  @ApiResponse({ status: 200, type: UpdateWordDTO })
  @Patch(':id')
  updateWord(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateWordDTO: UpdateWordDTO,
  ) {
    return this.wordsService.updateWord(id, updateWordDTO);
  }

  @ApiOperation({ summary: 'Видалення слова' })
  @ApiResponse({ status: 200 })
  @Delete(':id')
  deleteWord(@Param('id', ParseIntPipe) id: number) {
    return this.wordsService.deleteWord(id);
  }
}
