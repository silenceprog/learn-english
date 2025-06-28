import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateWordDTO } from './dto/update-word.dto';
import { DatabaseService } from 'src/database/database.service';
import { CreateWordDto } from './dto/create-word.dto';
import { Language, WordTaskType } from 'generated/prisma';
import { PaginationDto } from './dto/pagination.dto';

@Injectable()
export class WordsService {
  constructor(private readonly databaseService: DatabaseService) {}
  async createWord(userId: number, dto: CreateWordDto) {
    const taskTypes = Object.values(WordTaskType);

    return this.databaseService.word.create({
      data: {
        text: dto.text,
        language: dto.language,
        translate: dto.translate,
        meaning: dto.meaning,
        example: dto.example,
        partOfSpeech: dto.partOfSpeech,

        progresses: {
          create: taskTypes.map((taskType) => ({
            taskType,
            user: { connect: { id: userId } },
            isPassed: false,
            score: 0,
            attempts: 0,
          })),
        },
      },
      include: {
        progresses: true,
      },
    });
  }

  async searchWords(userId: number, query: string) {
  const setting = await this.databaseService.setting.findUnique({
    where: { userId },
  });

  if (!setting) {
    throw new NotFoundException('User settings not found');
  }

  return this.databaseService.word.findMany({
    where: {
      language: setting.current_language,
      text: {
        startsWith: query,
        mode: 'insensitive',
      },
      progresses: {
        some: {
          userId,
        },
      },
    },
    take: 10,
  });
}

  async findById(id: number) {
    return this.databaseService.word.findUnique({
      where: {
        id,
      },
    });
  }

  async getWordsByUserLanguage(
    userId: number,
    paginationDto: PaginationDto,
    type?: 'learned' | 'learning',
  ) {
    const { page = 1, limit = 10 } = paginationDto;
    const skip = (page - 1) * limit;

    const setting = await this.databaseService.setting.findUnique({
      where: { userId },
    });

    if (!setting) {
      throw new NotFoundException('User settings not found');
    }

    const baseWhere: any = {
      language: setting.current_language,
    };

    if (type === 'learned') baseWhere.isLearned = true;
    if (type === 'learning') baseWhere.isLearned = false;

    const [words, totalCount, learnedCount, learningCount] =
      await this.databaseService.$transaction([
        this.databaseService.word.findMany({
          where: baseWhere,
          skip,
          take: limit,
          include: {
            progresses: {
              where: { userId },
              select: {
                taskType: true,
                isPassed: true,
              },
            },
          },
        }),
        this.databaseService.word.count({
          where: {
            language: setting.current_language,
          },
        }),
        this.databaseService.word.count({
          where: {
            language: setting.current_language,
            isLearned: true,
          },
        }),
        this.databaseService.word.count({
          where: {
            language: setting.current_language,
            isLearned: false,
          },
        }),
      ]);

    return {
      data: words,
      page,
      limit,
      total: totalCount,
      learned: learnedCount,
      learning: learningCount,
      pages: Math.ceil(totalCount / limit),
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
