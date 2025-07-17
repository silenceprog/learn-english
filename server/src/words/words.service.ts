import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UpdateWordDTO } from './dto/update-word.dto';
import { DatabaseService } from 'src/database/database.service';
import { CreateWordDto } from './dto/create-word.dto';
import { WordTaskType } from 'generated/prisma';
import { PaginationDto } from './dto/pagination.dto';
import { TranslateService } from 'src/translate/translate.service';

@Injectable()
export class WordsService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly translateService: TranslateService,
  ) {}

  private processMeanings(meanings: any[]): {
    definitions: string[];
    synonyms: string[];
    antonyms: string[];
    examples: string[];
    partOfSpeech: string;
  } {
    const definitions: string[] = [];
    const synonyms: Set<string> = new Set();
    const antonyms: Set<string> = new Set();
    const examples: Set<string> = new Set();
    let partOfSpeech = '';

    if (meanings && meanings.length > 0) {
      partOfSpeech = meanings[0].partOfSpeech || '';

      meanings.forEach((meaning) => {
        if (meaning.synonyms && Array.isArray(meaning.synonyms)) {
          meaning.synonyms.forEach((synonym: string) => synonyms.add(synonym));
        }

        if (meaning.antonyms && Array.isArray(meaning.antonyms)) {
          meaning.antonyms.forEach((antonym: string) => antonyms.add(antonym));
        }

        if (meaning.definitions && Array.isArray(meaning.definitions)) {
          meaning.definitions.forEach((def: any) => {
            if (def.definition) {
              definitions.push(def.definition);
            }

            if (def.example) {
              examples.add(def.example);
            }

            if (def.synonyms && Array.isArray(def.synonyms)) {
              def.synonyms.forEach((synonym: string) => synonyms.add(synonym));
            }

            if (def.antonyms && Array.isArray(def.antonyms)) {
              def.antonyms.forEach((antonym: string) => antonyms.add(antonym));
            }
          });
        }
      });
    }

    return {
      definitions,
      synonyms: Array.from(synonyms),
      antonyms: Array.from(antonyms),
      examples: Array.from(examples),
      partOfSpeech,
    };
  }

  async createWord(userId: number, dto: CreateWordDto) {
    const taskTypes = Object.values(WordTaskType);
    const setting = await this.databaseService.setting.findUnique({
      where: { userId },
    });

    if (!setting) {
      throw new NotFoundException('User settings not found');
    }

    const existingWord = await this.databaseService.word.findUnique({
      where: {
        userId_text_language: {
          text: dto.text,
          language: setting.current_language,
          userId: userId,
        },
      },
    });

    if (existingWord) {
      throw new ConflictException('Word already exists for this user');
    }

    const data = await this.translateService.wordTranslate(
      dto.text,
      setting.current_language,
      setting.global_language,
    );

    const processedMeanings = data.meanings
      ? this.processMeanings(data.meanings)
      : {
          definitions: [],
          synonyms: [],
          antonyms: [],
          examples: [],
          partOfSpeech: '',
        };

    const finalDefinitions = [
      ...processedMeanings.definitions,
      ...(dto.definitions || []),
    ];

    const finalSynonyms = [
      ...processedMeanings.synonyms,
      ...(dto.synonyms || []),
    ];

    const finalAntonyms = [
      ...processedMeanings.antonyms,
      ...(dto.antonyms || []),
    ];

    const finalExamples = [
      ...processedMeanings.examples,
      ...(dto.examples || []),
    ];

    return this.databaseService.word.create({
      data: {
        text: dto.text,
        language: setting.current_language,
        translate: dto.translate,
        definitions: finalDefinitions,
        synonyms: finalSynonyms,
        antonyms: finalAntonyms,
        examples: finalExamples,
        partOfSpeech: dto.partOfSpeech || processedMeanings.partOfSpeech,
        phonetic: data.phonetic,
        audio: data.audio,
        phoneticUS: data.phoneticUS,
        audioUS: data.audioUS,
        userId: userId,

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

  async updateWordMeanings(
    wordId: number,
    userId: number,
    updateData: {
      definitions?: string[];
      synonyms?: string[];
      antonyms?: string[];
      examples?: string[];
      partOfSpeech?: string;
    },
  ) {
    const word = await this.databaseService.word.findFirst({
      where: { id: wordId, userId: userId },
    });

    if (!word) {
      throw new NotFoundException('Word not found or access denied');
    }

    return this.databaseService.word.update({
      where: { id: wordId },
      data: updateData,
    });
  }

  async findWordsBySynonym(synonym: string, userId: number) {
    return this.databaseService.word.findMany({
      where: {
        synonyms: {
          has: synonym,
        },
        progresses: {
          some: {
            userId: userId,
          },
        },
      },
      include: {
        progresses: {
          where: {
            userId: userId,
          },
        },
      },
    });
  }

  async getPartOfSpeechStats(userId: number) {
    const words = await this.databaseService.word.findMany({
      where: {
        progresses: {
          some: {
            userId: userId,
          },
        },
        partOfSpeech: {
          not: null,
        },
      },
      select: {
        partOfSpeech: true,
      },
    });

    const stats = words.reduce(
      (acc, word) => {
        if (word.partOfSpeech) {
          acc[word.partOfSpeech] = (acc[word.partOfSpeech] || 0) + 1;
        }
        return acc;
      },
      {} as Record<string, number>,
    );

    return Object.entries(stats).map(([partOfSpeech, count]) => ({
      partOfSpeech,
      count,
    }));
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

  async updateWordTotalProgress(userId: number, wordId: number): Promise<void> {
    const allTaskTypes = Object.keys(WordTaskType) as WordTaskType[];

    const progresses = await this.databaseService.wordTaskProgress.findMany({
      where: {
        userId,
        wordId,
      },
    });

    const passedCount = progresses.filter((p) => p.isPassed).length;

    const totalTypes = allTaskTypes.length;
    const totalProgress = Math.round((passedCount / totalTypes) * 100);

    const isLearned = passedCount === totalTypes;

    await this.databaseService.word.update({
      where: { id: wordId },
      data: {
        totalProgress,
        isLearned,
      },
    });
  }

  async updateTaskProgress(data: {
    userId: number;
    wordId: number;
    taskType: WordTaskType;
    isPassed: boolean;
    score: number;
  }) {
    await this.databaseService.wordTaskProgress.upsert({
      where: {
        userId_wordId_taskType: {
          userId: data.userId,
          wordId: data.wordId,
          taskType: data.taskType,
        },
      },
      update: {
        isPassed: data.isPassed,
        score: data.score,
        attempts: { increment: 1 },
      },
      create: {
        userId: data.userId,
        wordId: data.wordId,
        taskType: data.taskType,
        isPassed: data.isPassed,
        score: data.score,
        attempts: 1,
      },
    });
  }

  async getWordsByUserLanguage(userId: number, paginationDto: PaginationDto) {
    const { page = 1, limit = 10, type } = paginationDto;
    const skip = (page - 1) * limit;

    const setting = await this.databaseService.setting.findUnique({
      where: { userId },
    });

    if (!setting) {
      throw new NotFoundException('User settings not found');
    }

    const [allWords, totalCount, learnedCount, learningCount] =
      await this.databaseService.$transaction([
        this.databaseService.word.findMany({
          where: {
            language: setting.current_language,
            progresses: {
              some: {
                userId,
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
          include: {
            progresses: {
              where: { userId },
            },
          },
        }),
        this.databaseService.word.count({
          where: {
            language: setting.current_language,
            progresses: {
              some: {
                userId,
              },
            },
          },
        }),
        this.databaseService.word.count({
          where: {
            language: setting.current_language,
            isLearned: true,
            progresses: {
              some: {
                userId,
              },
            },
          },
        }),
        this.databaseService.word.count({
          where: {
            language: setting.current_language,
            isLearned: false,
            progresses: {
              some: {
                userId,
              },
            },
          },
        }),
      ]);

    const filteredWords = allWords.filter((word) => {
      const userProgresses = word.progresses;
      const allPassed =
        userProgresses.length > 0 && userProgresses.every((p) => p.isPassed);

      if (type === 'LEARNED') return allPassed;
      if (type === 'LEARNING') return !allPassed;

      return true;
    });

    const paginatedWords = filteredWords.slice(skip, skip + limit);

    return {
      data: paginatedWords,
      page,
      limit,
      total: totalCount,
      learning: learningCount,
      learned: learnedCount,
      pages: Math.ceil(filteredWords.length / limit),
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

  async deleteUserWord(wordId: number, userId: number) {
    const word = await this.databaseService.word.findFirst({
      where: { id: wordId, userId: userId },
    });

    if (!word) {
      throw new NotFoundException('Word not found or access denied');
    }

    return this.databaseService.word.delete({
      where: { id: wordId },
    });
  }
}
