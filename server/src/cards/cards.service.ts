import { Injectable, NotFoundException } from '@nestjs/common';
import { FlashcardQueryDto } from './dto/flashcard-query.dto';
import { FlashcardAnswerDto } from './dto/flashcard-answer.dto';
import { DatabaseService } from 'src/database/database.service';
import { FlashcardResponseDto } from './dto/flashcard-response.dto';
import { Language, TaskType } from 'generated/prisma';

@Injectable()
export class FlashCardService {
  constructor(private databaseService: DatabaseService) {}
  async getTaskWords(
    userId: number,
    query: FlashcardQueryDto,
  ): Promise<FlashcardResponseDto[]> {
    const {
      language,
      limit,
      reviewOnly,
      taskType = TaskType.FLASHCARDS,
    } = query;

    const where: any = {
      userId,
      ...(language && { language }),
    };

    let words;

    if (reviewOnly) {
      words = await this.getWordsForReview(userId, taskType, limit);
    } else {
      words = await this.getWordsForNewTask(userId, taskType, where, limit);
    }

    return words.map((word) => this.formatFlashcardResponse(word, taskType));
  }

  async getWordsForReview(
    userId: number,
    taskType: TaskType = TaskType.FLASHCARDS,
    limit: number = 20,
  ) {
    const wordProgresses = await this.databaseService.wordTaskProgress.findMany(
      {
        where: {
          userId,
          taskType,
          nextReviewAt: { lte: new Date() },
          isPassed: true,
        },
        include: {
          word: true,
        },
        take: limit,
        orderBy: {
          nextReviewAt: 'asc',
        },
      },
    );

    return wordProgresses.map((progress) => ({
      ...progress.word,
      nextReviewAt: progress.nextReviewAt,
      reviewInterval: progress.reviewInterval,
      attempts: progress.attempts,
      correctCount: progress.correctCount,
      taskType: progress.taskType,
    }));
  }

  private async getWordsForNewTask(
  userId: number,
  taskType: TaskType,
  where: any,
  limit?: number,
) {
  const words = await this.databaseService.word.findMany({
    where,
    include: {
      progresses: {
        where: {
          userId,
          taskType,
        },
        select: {
          nextReviewAt: true,
          reviewInterval: true,
          attempts: true,
          correctCount: true,
          isPassed: true,
          taskType: true,
        },
      },
    },
    orderBy: [
      { isLearned: 'asc' },
      { totalProgress: 'asc' },
      { createdAt: 'desc' },
    ],
  });

  return words
    .filter(
      (word) =>
        word.progresses.length === 0 ||
        !word.progresses.some((p) => p.isPassed && p.taskType === taskType),
    )
    .slice(0, limit)
    .map((word) => ({
      ...word,
      nextReviewAt: word.progresses[0]?.nextReviewAt,
      reviewInterval: word.progresses[0]?.reviewInterval || 1,
      attempts: word.progresses[0]?.attempts || 0,
      correctCount: word.progresses[0]?.correctCount || 0,
      taskType,
    }));
}

  async checkAnswer(userId: number, answer: FlashcardAnswerDto) {
    const {
      wordId,
      userAnswer,
      timeSpent,
      difficulty,
      taskType = TaskType.FLASHCARDS,
    } = answer;

    const word = await this.databaseService.word.findFirst({
      where: { id: wordId, userId },
    });

    if (!word) {
      throw new NotFoundException('Слово не знайдено');
    }

    const isCorrect = this.checkAnswerCorrectness(
      userAnswer,
      word.translate,
      word.text,
      taskType,
    );
    const score = this.calculateScore(isCorrect, timeSpent, difficulty);
    const progress = await this.updateWordProgress(
      userId,
      wordId,
      isCorrect,
      score,
      timeSpent,
      difficulty,
      taskType,
    );

    await this.updateWordStats(wordId, isCorrect);
    await this.updateSkillProgress(
      userId,
      word.language,
      isCorrect,
      score,
      timeSpent,
    );
    await this.updateDailyStats(
      userId,
      word.language,
      score,
      timeSpent,
      isCorrect,
    );

    return {
      isCorrect,
      score,
      correctAnswer: this.getCorrectAnswer(word, taskType),
      explanation: word.definitions[0] || null,
      nextReviewAt: progress.nextReviewAt,
      taskType,
      progress: {
        attempts: progress.attempts,
        correctCount: progress.correctCount,
        accuracy:
          progress.attempts > 0
            ? (progress.correctCount / progress.attempts) * 100
            : 0,
      },
    };
  }

  async getFlashcardStats(
    userId: number,
    language?: Language,
    taskType?: TaskType,
  ) {
    const where: any = { userId };
    if (language) where.language = language;

    const totalWords = await this.databaseService.word.count({ where });
    const learnedWords = await this.databaseService.word.count({
      where: { ...where, isLearned: true },
    });

    let taskTypeStats = {};
    if (taskType) {
      const reviewWords = await this.databaseService.wordTaskProgress.count({
        where: {
          userId,
          taskType,
          nextReviewAt: { lte: new Date() },
          isPassed: true,
        },
      });

      const completedWords = await this.databaseService.wordTaskProgress.count({
        where: {
          userId,
          taskType,
          isPassed: true,
        },
      });

      taskTypeStats = {
        taskType,
        reviewWords,
        completedWords,
        newWords: totalWords - completedWords,
      };
    }

    const todayStats = await this.databaseService.dailyStats.findFirst({
      where: {
        userId,
        date: new Date(),
        ...(language && { language }),
      },
    });

    return {
      totalWords,
      learnedWords,
      learningWords: totalWords - learnedWords,
      ...(taskType && { taskTypeStats }),
      todayStats: {
        wordsStudied: todayStats?.newWordsLearned || 0,
        wordsReviewed: todayStats?.wordsReviewed || 0,
        timeSpent: todayStats?.totalTime || 0,
        xpEarned: todayStats?.totalXP || 0,
      },
    };
  }

  async getWordTaskProgress(
    userId: number,
    wordId: number,
    taskType: TaskType,
  ) {
    return await this.databaseService.wordTaskProgress.findUnique({
      where: {
        wordId_userId_taskType: {
          wordId,
          userId,
          taskType,
        },
      },
    });
  }

  async upsertWordTaskProgress(
    userId: number,
    wordId: number,
    taskType: TaskType,
    data: any,
  ) {
    return await this.databaseService.wordTaskProgress.upsert({
      where: {
        wordId_userId_taskType: {
          wordId,
          userId,
          taskType,
        },
      },
      create: {
        wordId,
        userId,
        taskType,
        ...data,
      },
      update: data,
    });
  }

  async getWordsNeedingPractice(
    userId: number,
    taskType: TaskType,
    limit: number = 20,
  ) {
    const words = await this.databaseService.word.findMany({
      where: {
        userId,
        progresses: {
          some: {
            userId,
            taskType,
            isPassed: false,
          },
        },
      },
      include: {
        progresses: {
          where: {
            userId,
            taskType,
          },
        },
      },
      take: limit,
      orderBy: {
        createdAt: 'desc',
      },
    });

    return words.map((word: any) => ({
      ...word,
      progress: word.progresses?.[0] || null,
    }));
  }

  private formatFlashcardResponse(
    word: any,
    taskType?: TaskType,
  ): FlashcardResponseDto {
    return {
      id: word.id,
      text: word.text,
      language: word.language,
      translate: word.translate,
      examples: word.examples,
      phonetic: word.phonetic,
      audio: word.audio,
      phoneticUS: word.phoneticUS,
      audioUS: word.audioUS,
      totalProgress: word.totalProgress,
      isLearned: word.isLearned,
      nextReviewAt: word.nextReviewAt,
      reviewInterval: word.reviewInterval,
      attempts: word.attempts,
      correctCount: word.correctCount,
      taskType: taskType || TaskType.FLASHCARDS,
    };
  }

  private checkAnswerCorrectness(
    userAnswer: string,
    correctAnswers: string[],
    originalWord: string,
    taskType: TaskType,
  ): boolean {
    const normalizedUserAnswer = userAnswer.toLowerCase().trim();

    switch (taskType) {
      case TaskType.FLASHCARDS:
        // Перевіряємо переклад
        return correctAnswers.some(
          (answer) => answer.toLowerCase().trim() === normalizedUserAnswer,
        );

      case TaskType.REVERSE_FLASHCARDS:
        // Перевіряємо оригінальне слово
        return originalWord.toLowerCase().trim() === normalizedUserAnswer;

      case TaskType.FILL_IN_THE_BLANK:
        // Для заповнення пропусків - можливі варіанти відповідей
        return (
          correctAnswers.some(
            (answer) => answer.toLowerCase().trim() === normalizedUserAnswer,
          ) || originalWord.toLowerCase().trim() === normalizedUserAnswer
        );

      case TaskType.MATCHING:
        // Для matching задач - точне співпадіння
        return correctAnswers.some(
          (answer) => answer.toLowerCase().trim() === normalizedUserAnswer,
        );

      default:
        return correctAnswers.some(
          (answer) => answer.toLowerCase().trim() === normalizedUserAnswer,
        );
    }
  }

  private getCorrectAnswer(word: any, taskType: TaskType): string | string[] {
    switch (taskType) {
      case TaskType.FLASHCARDS:
        return word.translate;
      case TaskType.REVERSE_FLASHCARDS:
        return word.text;
      case TaskType.FILL_IN_THE_BLANK:
      case TaskType.MATCHING:
        return word.translate;
      default:
        return word.translate;
    }
  }

  private calculateScore(
    isCorrect: boolean,
    timeSpent: number,
    difficulty?: number,
  ): number {
    if (!isCorrect) return 0;

    let baseScore = 10;

    // Бонус за швидкість
    if (timeSpent < 10) baseScore += 5;
    else if (timeSpent > 30) baseScore -= 2;

    // Штраф/бонус за складність
    if (difficulty) {
      if (difficulty <= 2) baseScore += 3;
      else if (difficulty >= 4) baseScore -= 2;
    }

    return Math.max(1, baseScore);
  }

  private async updateWordProgress(
    userId: number,
    wordId: number,
    isCorrect: boolean,
    score: number,
    timeSpent: number,
    difficulty?: number,
    taskType: TaskType = TaskType.FLASHCARDS,
  ) {
    const existingProgress =
      await this.databaseService.wordTaskProgress.findUnique({
        where: {
          wordId_userId_taskType: {
            wordId,
            userId,
            taskType,
          },
        },
      });

    const now = new Date();
    let nextReviewAt: Date;
    let reviewInterval: number;
    let easeFactor: number;

    if (existingProgress) {
      // Алгоритм інтервального повторення
      if (isCorrect) {
        reviewInterval = Math.ceil(
          existingProgress.reviewInterval * existingProgress.easeFactor,
        );
        easeFactor =
          existingProgress.easeFactor +
          (0.1 -
            (5 - (difficulty || 3)) * (0.08 + (5 - (difficulty || 3)) * 0.02));
      } else {
        reviewInterval = 1;
        easeFactor = Math.max(1.3, existingProgress.easeFactor - 0.2);
      }

      easeFactor = Math.max(1.3, Math.min(2.5, easeFactor));
      nextReviewAt = new Date(
        now.getTime() + reviewInterval * 24 * 60 * 60 * 1000,
      );

      return await this.databaseService.wordTaskProgress.update({
        where: {
          wordId_userId_taskType: {
            wordId,
            userId,
            taskType,
          },
        },
        data: {
          attempts: existingProgress.attempts + 1,
          correctCount: existingProgress.correctCount + (isCorrect ? 1 : 0),
          score: existingProgress.score + score,
          isPassed: isCorrect || existingProgress.isPassed,
          nextReviewAt,
          reviewInterval,
          easeFactor,
          lastAttempt: now,
          timeSpent: existingProgress.timeSpent + timeSpent,
          updatedAt: now,
        },
      });
    } else {
      // Створюємо новий прогрес
      reviewInterval = isCorrect ? 1 : 1;
      easeFactor = 2.5;
      nextReviewAt = new Date(
        now.getTime() + reviewInterval * 24 * 60 * 60 * 1000,
      );

      return await this.databaseService.wordTaskProgress.create({
        data: {
          wordId,
          userId,
          taskType,
          attempts: 1,
          correctCount: isCorrect ? 1 : 0,
          score,
          isPassed: isCorrect,
          nextReviewAt,
          reviewInterval,
          easeFactor,
          lastAttempt: now,
          timeSpent,
        },
      });
    }
  }

  private async updateWordStats(wordId: number, isCorrect: boolean) {
    const word = await this.databaseService.word.findUnique({
      where: { id: wordId },
      include: {
        progresses: true,
      },
    });

    if (word) {
      const totalAttempts = word.progresses.reduce(
        (sum, p) => sum + p.attempts,
        0,
      );
      const totalCorrect = word.progresses.reduce(
        (sum, p) => sum + p.correctCount,
        0,
      );
      const progress =
        totalAttempts > 0
          ? Math.round((totalCorrect / totalAttempts) * 100)
          : 0;

      await this.databaseService.word.update({
        where: { id: wordId },
        data: {
          totalProgress: progress,
          isLearned: progress >= 80 && totalAttempts >= 3,
        },
      });
    }
  }

  private async updateSkillProgress(
    userId: number,
    language: Language,
    isCorrect: boolean,
    score: number,
    timeSpent: number,
  ) {
    const languageProgress =
      await this.databaseService.languageProgress.findUnique({
        where: {
          userId_language: { userId, language },
        },
      });

    if (!languageProgress) return;

    await this.databaseService.skillProgress.upsert({
      where: {
        userId_languageProgressId_skillType: {
          userId,
          languageProgressId: languageProgress.id,
          skillType: 'VOCABULARY',
        },
      },
      create: {
        userId,
        languageProgressId: languageProgress.id,
        skillType: 'VOCABULARY',
        xpEarned: score,
        totalPracticed: 1,
        correctAnswers: isCorrect ? 1 : 0,
        totalAnswers: 1,
        currentAccuracy: isCorrect ? 100 : 0,
        timeSpent,
        totalWordsStudied: 1,
        wordsLearned: 0,
        lastPracticed: new Date(),
      },
      update: {
        xpEarned: { increment: score },
        totalPracticed: { increment: 1 },
        correctAnswers: { increment: isCorrect ? 1 : 0 },
        totalAnswers: { increment: 1 },
        timeSpent: { increment: timeSpent },
        totalWordsStudied: { increment: 1 },
        lastPracticed: new Date(),
        currentAccuracy: {
          set: 0,
        },
      },
    });

    const skillProgress = await this.databaseService.skillProgress.findUnique({
      where: {
        userId_languageProgressId_skillType: {
          userId,
          languageProgressId: languageProgress.id,
          skillType: 'VOCABULARY',
        },
      },
    });

    if (skillProgress && skillProgress.totalAnswers > 0) {
      const accuracy =
        (skillProgress.correctAnswers / skillProgress.totalAnswers) * 100;
      await this.databaseService.skillProgress.update({
        where: { id: skillProgress.id },
        data: { currentAccuracy: accuracy },
      });
    }
  }

  private async updateDailyStats(
    userId: number,
    language: Language,
    score: number,
    timeSpent: number,
    isCorrect: boolean,
  ) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    await this.databaseService.dailyStats.upsert({
      where: {
        userId_language_date: {
          userId,
          language,
          date: today,
        },
      },
      create: {
        userId,
        language,
        date: today,
        totalXP: score,
        totalTime: timeSpent,
        tasksCompleted: 1,
        averageAccuracy: isCorrect ? 100 : 0,
        newWordsLearned: 1,
        wordsReviewed: 0,
      },
      update: {
        totalXP: { increment: score },
        totalTime: { increment: timeSpent },
        tasksCompleted: { increment: 1 },
        newWordsLearned: { increment: 1 },
      },
    });
  }
}
