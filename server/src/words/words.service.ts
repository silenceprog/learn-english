import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateWordDTO } from './dto/update-word.dto';
import { DatabaseService } from 'src/database/database.service';
import { CreateWordDto } from './dto/create-word.dto';
import { Language } from 'generated/prisma';

@Injectable()
export class WordsService {
  constructor(private readonly databaseService: DatabaseService) {}
  async createWord(createWordDto: CreateWordDto) {
    return this.databaseService.word.create({
      data: createWordDto,
    });
  }

  async findAll() {
    return this.databaseService.video.findMany();
  }

  async findById(id: number) {
    return this.databaseService.word.findUnique({
      where: {
        id,
      },
    });
  }

  async getWordsByLanguage(userId: number,language: Language) {
    return this.databaseService.word.findMany({
      where: { language },
    });
  }

  async getWordsByUserLanguage(userId: number) {
    const setting = await this.databaseService.setting.findUnique({
      where: { userId },
    });

    if (!setting) {
    throw new NotFoundException('User settings not found');
    }

    return this.databaseService.word.findMany({
      where: {
        language: setting?.curent_language,
      },
    });
  }

  async updateWord(id: number, updateWordDto: UpdateWordDTO) {
    return this.databaseService.word.update({
      where: {
        id,
      },
      data: updateWordDto,
    });
  }

  async deleteWord(id: number) {
    return this.databaseService.word.delete({
      where: {
        id,
      },
    });
  }
}
