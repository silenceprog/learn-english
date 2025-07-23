import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UpdateWordDTO } from './dto/update-word.dto';
import { DatabaseService } from 'src/database/database.service';
import { CreateWordDto } from './dto/create-word.dto';
import { PaginationDto } from './dto/pagination.dto';
import { TranslateService } from 'src/translate/translate.service';
import { CoreSkillType } from 'generated/prisma';

@Injectable()
export class WordsService {
   constructor(
    private readonly databaseService: DatabaseService,
    private readonly translateService: TranslateService,
  ) {}

  async createWord(userId: number, dto: CreateWordDto) {
    const vocabularySkills = [CoreSkillType.VOCABULARY, CoreSkillType.READING, CoreSkillType.LISTENING];
    
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
      ? this.translateService.processMeanings(data.meanings)
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

    return this.databaseService.$transaction(async (tx) => {
      const word = await tx.word.create({
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
        },
      });

      await tx.wordTaskProgress.createMany({
        data: vocabularySkills.map((skillType) => ({
          wordId: word.id,
          userId: userId,
          skillType,
          nextReviewAt: new Date(), 
        })),
      });

      await this.updateVocabularyProgress(tx, userId, setting.current_language);

      return word;
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
        userId,
        language: setting.current_language,
        text: {
          startsWith: query,
          mode: 'insensitive',
        },
      },
      take: 10,
    });
  }

  async findById(id: number, userId?: number) {
    const word = await this.databaseService.word.findUnique({
      where: { id },
      include: {
        progresses: userId ? {
          where: { userId }
        } : true,
      },
    });

    return word;
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

    const whereClause = {
      userId,
      language: setting.current_language,
      ...(type === 'LEARNED' && { isLearned: true }),
      ...(type === 'LEARNING' && { isLearned: false }),
    };

    const [words, totalCount, learnedCount, learningCount] = 
      await this.databaseService.$transaction([
        this.databaseService.word.findMany({
          where: whereClause,
          orderBy: { createdAt: 'desc' },
          skip,
          take: limit,
          include: {
            progresses: {
              where: { userId },
            },
          },
        }),
        this.databaseService.word.count({
          where: { userId, language: setting.current_language },
        }),
        this.databaseService.word.count({
          where: { 
            userId, 
            language: setting.current_language,
            isLearned: true 
          },
        }),
        this.databaseService.word.count({
          where: { 
            userId, 
            language: setting.current_language,
            isLearned: false 
          },
        }),
      ]);

    return {
      data: words,
      page,
      limit,
      total: totalCount,
      learning: learningCount,
      learned: learnedCount,
      pages: Math.ceil(totalCount / limit),
    };
  }

  async updateWord(id: number, userId: number, updateWordDto: UpdateWordDTO) {
    const word = await this.databaseService.word.findFirst({
      where: { id, userId },
    });

    if (!word) {
      throw new NotFoundException('Word not found or access denied');
    }

    return this.databaseService.word.update({
      where: { id },
      data: updateWordDto,
    });
  }

  async deleteUserWord(userId: number, id: number) {
    const word = await this.databaseService.word.findFirst({
      where: { id, userId },
    });

    if (!word) {
      throw new NotFoundException('Word not found or access denied');
    }

    return this.databaseService.$transaction(async (tx) => {
      const deletedWord = await tx.word.delete({
        where: { id },
      });

      const setting = await tx.setting.findUnique({
        where: { userId },
      });

      if (setting) {
        await this.updateVocabularyProgress(tx, userId, setting.current_language);
      }

      return deletedWord;
    });
  }

  async markWordAsLearned(userId: number, wordId: number) {
    const word = await this.databaseService.word.findFirst({
      where: { id: wordId, userId },
    });

    if (!word) {
      throw new NotFoundException('Word not found or access denied');
    }

    return this.databaseService.$transaction(async (tx) => {
      const updatedWord = await tx.word.update({
        where: { id: wordId },
        data: { 
          isLearned: true,
          totalProgress: 100 
        },
      });

      await this.updateVocabularyProgress(tx, userId, word.language);

      await this.addXPForWordLearning(tx, userId, word.language);

      return updatedWord;
    });
  }

 async getWordsForReview(userId: number, skillType?: CoreSkillType, limit: number = 10) {
  const setting = await this.databaseService.setting.findUnique({
    where: { userId },
  });

  if (!setting) {
    throw new NotFoundException('User settings not found');
  }

  const wordProgresses = await this.databaseService.wordTaskProgress.findMany({
    where: {
      userId,
      ...(skillType && { skillType }),
      nextReviewAt: { lte: new Date() },
      word: {
        language: setting.current_language,
      },
    },
    orderBy: [
      { score: 'asc' },     
      { nextReviewAt: 'asc' } 
    ],
    take: limit,
    include: {
      word: true,
    },
  });

  return wordProgresses.map(progress => ({
    ...progress.word,
    taskProgress: {
      skillType: progress.skillType,
      score: progress.score,
      attempts: progress.attempts,
      isPassed: progress.isPassed,
    },
  }));
}

  async updateWordProgress(
    userId: number, 
    wordId: number, 
    progressData: {
      correct: boolean;
      timeSpent: number;
      skillType: CoreSkillType;
    }
  ) {
    const wordProgress = await this.databaseService.wordTaskProgress.findUnique({
      where: {
        wordId_userId_skillType: {
          wordId,
          userId,
          skillType: progressData.skillType,
        },
      },
      include: { word: true },
    });

    if (!wordProgress) {
      throw new NotFoundException('Word progress not found');
    }

    return this.databaseService.$transaction(async (tx) => {
      const newScore = this.calculateNewScore(
        wordProgress.score, 
        progressData.correct,
        wordProgress.attempts
      );
      
      const { nextReviewAt, reviewInterval, easeFactor } = 
        this.calculateNextReview(
          progressData.correct,
          wordProgress.reviewInterval,
          wordProgress.easeFactor
        );

      const updatedProgress = await tx.wordTaskProgress.update({
        where: { id: wordProgress.id },
        data: {
          score: newScore,
          attempts: { increment: 1 },
          correctCount: progressData.correct ? 
            { increment: 1 } : undefined,
          timeSpent: { increment: progressData.timeSpent },
          isPassed: newScore >= 80, 
          nextReviewAt,
          reviewInterval,
          easeFactor,
          lastAttempt: new Date(),
        },
      });

      await this.checkWordCompletion(tx, wordId, userId);

      await this.updateVocabularyProgress(tx, userId, wordProgress.word.language);

      const xpGain = progressData.correct ? 10 : 5;
      await this.addXPToUser(tx, userId, wordProgress.word.language, xpGain, progressData.timeSpent);

      return updatedProgress;
    });
  }

  private calculateNewScore(currentScore: number, correct: boolean, attempts: number): number {
    if (correct) {
      const increment = Math.max(20 - attempts * 2, 5);
      return Math.min(currentScore + increment, 100);
    } else {
      return Math.max(currentScore - 10, 0);
    }
  }

  private calculateNextReview(
    correct: boolean, 
    currentInterval: number, 
    currentEase: number
  ): { nextReviewAt: Date; reviewInterval: number; easeFactor: number } {
    let newInterval = currentInterval;
    let newEase = currentEase;

    if (correct) {
      newInterval = Math.ceil(currentInterval * currentEase);
      newEase = Math.min(currentEase + 0.1, 3.0);
    } else {
      newInterval = 1;
      newEase = Math.max(currentEase - 0.2, 1.3);
    }

    const nextReviewAt = new Date();
    nextReviewAt.setDate(nextReviewAt.getDate() + newInterval);

    return { nextReviewAt, reviewInterval: newInterval, easeFactor: newEase };
  }

  private async checkWordCompletion(tx: any, wordId: number, userId: number) {
    const allProgresses = await tx.wordTaskProgress.findMany({
      where: { wordId, userId },
    });

    const allPassed = allProgresses.every(p => p.isPassed);
    const averageScore = allProgresses.reduce((sum, p) => sum + p.score, 0) / allProgresses.length;

    await tx.word.update({
      where: { id: wordId },
      data: {
        isLearned: allPassed,
        totalProgress: Math.round(averageScore),
      },
    });
  }
  private async updateVocabularyProgress(tx: any, userId: number, language: any) {
    let languageProgress = await tx.languageProgress.findUnique({
      where: { userId_language: { userId, language } },
    });

    if (!languageProgress) {
      languageProgress = await tx.languageProgress.create({
        data: { userId, language },
      });
    }

    let skillProgress = await tx.skillProgress.findUnique({
      where: {
        userId_languageProgressId_skillType: {
          userId,
          languageProgressId: languageProgress.id,
          skillType: CoreSkillType.VOCABULARY,
        },
      },
    });

    if (!skillProgress) {
      skillProgress = await tx.skillProgress.create({
        data: {
          userId,
          languageProgressId: languageProgress.id,
          skillType: CoreSkillType.VOCABULARY,
        },
      });
    }

    const [totalWords, learnedWords] = await Promise.all([
      tx.word.count({
        where: { userId, language },
      }),
      tx.word.count({
        where: { userId, language, isLearned: true },
      }),
    ]);

    await tx.skillProgress.update({
      where: { id: skillProgress.id },
      data: {
        totalWordsStudied: totalWords,
        wordsLearned: learnedWords,
        wordsReviewing: totalWords - learnedWords,
        lastPracticed: new Date(),
      },
    });
  }

  private async addXPForWordLearning(tx: any, userId: number, language: any) {
    const xpGain = 20; 
    await this.addXPToUser(tx, userId, language, xpGain, 0);
  }

  private async addXPToUser(
    tx: any, 
    userId: number, 
    language: any, 
    xpGain: number, 
    timeSpent: number
  ) {
    await tx.user.update({
      where: { id: userId },
      data: {
        totalXP: { increment: xpGain },
        totalLearningTime: { increment: timeSpent },
        lastActiveAt: new Date(),
      },
    });

    await tx.languageProgress.updateMany({
      where: { userId, language },
      data: {
        totalXP: { increment: xpGain },
        totalTime: { increment: timeSpent },
        lastActiveAt: new Date(),
      },
    });

    const languageProgress = await tx.languageProgress.findUnique({
      where: { userId_language: { userId, language } },
    });

    if (languageProgress) {
      await tx.skillProgress.updateMany({
        where: {
          userId,
          languageProgressId: languageProgress.id,
          skillType: CoreSkillType.VOCABULARY,
        },
        data: {
          xpEarned: { increment: xpGain },
          timeSpent: { increment: timeSpent },
        },
      });
    }

    await this.updateDailyStats(tx, userId, language, xpGain, timeSpent);
  }

  private async updateDailyStats(
    tx: any,
    userId: number,
    language: any,
    xpGain: number,
    timeSpent: number
  ) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const existingStats = await tx.dailyStats.findUnique({
      where: {
        userId_language_date: {
          userId,
          language,
          date: today,
        },
      },
    });

    if (existingStats) {
      await tx.dailyStats.update({
        where: { id: existingStats.id },
        data: {
          totalXP: { increment: xpGain },
          totalTime: { increment: timeSpent },
          newWordsLearned: { increment: 1 },
        },
      });
    } else {
      await tx.dailyStats.create({
        data: {
          userId,
          language,
          date: today,
          totalXP: xpGain,
          totalTime: timeSpent,
          newWordsLearned: 1,
        },
      });
    }
  }

}
