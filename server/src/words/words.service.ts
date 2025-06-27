import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateWordDTO } from './dto/update-word.dto';
import { DatabaseService } from 'src/database/database.service';
import { CreateWordDto } from './dto/create-word.dto';
import { Language } from 'generated/prisma';
import { PaginationDto } from './dto/pagination.dto';

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

  async getWordsByLanguage(userId: number, language: Language) {
    return this.databaseService.word.findMany({
      where: { language },
    });
  }

  async getWordsByUserLanguage(userId: number, paginationDto: PaginationDto) {
    const { page = 1, limit = 10 } = paginationDto;
    const skip = (page - 1) * limit;
    const setting = await this.databaseService.setting.findUnique({
      where: { userId },
    });

    if (!setting) {
      throw new NotFoundException('User settings not found');
    }

    const [data, total] = await this.databaseService.$transaction([
      this.databaseService.word.findMany({
        where: {
          language: setting?.current_language,
        },
        skip,
        take: limit,
      }),
      this.databaseService.word.count(),
    ]);
    

    return {
      data,
      total,
      page,
      limit,
      pages: Math.ceil(total / limit),
    };
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
