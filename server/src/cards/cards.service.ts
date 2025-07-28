import { Injectable, BadRequestException } from '@nestjs/common';
import { ProgressService } from '../progress/progress.service';
import { GetFlashcardsDto } from './dto/flashcard.dto';
import { CreateFlashcardDto} from './dto/create-card.dto';
import {FlashcardAnswerDto} from './dto/flashcard-answer.dto';
import { Language } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';
import { CEFRLevel, MasteryLevel } from 'generated/prisma';

@Injectable()
export class FlashCardService {
  constructor(
    private databaseService: DatabaseService,
    private progressService: ProgressService,
  ) {}

  // Отримання карточок для користувача
  async getFlashcardsForUser(userId: number, query: GetFlashcardsDto) {
    const { language, masteryLevel, cefrLevel, limit = 20, offset = 0 } = query;

    const where: any = { userId };
    
    if (language) where.language = language;
    if (masteryLevel) where.masteryLevel = masteryLevel;
    
    // Фільтр по CEFR рівню слів
    if (cefrLevel) {
      where.word = {
        cefrLevel: cefrLevel
      };
    }

    const flashcards = await this.databaseService.wordSnapshot.findMany({
      where,
      include: {
        user: {
          select: { id: true, username: true }
        }
      },
      orderBy: [
        { nextReviewAt: 'asc' },
        { updatedAt: 'desc' }
      ],
      take: limit,
      skip: offset,
    });

    return {
      flashcards: flashcards.map(card => this.formatFlashcard(card)),
      total: await this.databaseService.wordSnapshot.count({ where }),
      hasMore: flashcards.length === limit
    };
  }

  // Отримання карточок для повторення (spaced repetition)
  async getCardsForReview(userId: number, language?: Language) {
    const now = new Date();
    
    const where: any = {
      userId,
      nextReviewAt: {
        lte: now
      }
    };

    if (language) where.language = language;

    const reviewCards = await this.databaseService.wordSnapshot.findMany({
      where,
      orderBy: [
        { nextReviewAt: 'asc' },
        { difficulty: 'desc' } // складніші слова першими
      ],
      take: 50, // максимум 50 карточок за сесію
    });

    return {
      cards: reviewCards.map(card => this.formatFlashcard(card)),
      totalDue: reviewCards.length,
      nextReviewAt: await this.getNextReviewTime(userId, language)
    };
  }

  // Обробка відповіді користувача
  async processAnswer(userId: number, answerDto: FlashcardAnswerDto) {
    const { wordId, answer, isCorrect, responseTime, language } = answerDto;

    // Знаходимо карточку
    let wordSnapshot = await this.databaseService.wordSnapshot.findUnique({
      where: {
        userId_word_language: {
          userId,
          word: wordId,
          language
        }
      }
    });

    if (!wordSnapshot) {
      throw new BadRequestException('Flashcard not found');
    }

    // Оновлюємо статистику
    const updatedStats = {
      totalAttempts: wordSnapshot.totalAttempts + 1,
      correctAttempts: wordSnapshot.correctAttempts + (isCorrect ? 1 : 0),
    };

    // Розраховуємо новий інтервал повторення (SM-2 алгоритм)
    const smResult = this.calculateSM2(
      wordSnapshot.difficulty,
      wordSnapshot.reviewInterval,
      isCorrect ? 5 : 1 // якість відповіді (1-5)
    );

    // Визначаємо новий рівень засвоєння
    const newMasteryLevel = this.calculateMasteryLevel(
      updatedStats.correctAttempts,
      updatedStats.totalAttempts,
      wordSnapshot.masteryLevel
    );

    // Оновлюємо карточку
    wordSnapshot = await this.databaseService.wordSnapshot.update({
      where: { id: wordSnapshot.id },
      data: {
        ...updatedStats,
        masteryLevel: newMasteryLevel,
        difficulty: smResult.difficulty,
        reviewInterval: smResult.interval,
        lastReviewedAt: new Date(),
        nextReviewAt: smResult.nextReview,
        updatedAt: new Date(),
      }
    });

    // Оновлюємо прогрес навички VOCABULARY
    await this.progressService.updateSkillProgress(userId, language, 'VOCABULARY', {
      isCorrect,
      xpEarned: this.calculateXP(isCorrect, responseTime, newMasteryLevel),
      timeSpent: responseTime,
      wordLearned: newMasteryLevel === 'MASTERED' && wordSnapshot.masteryLevel !== 'MASTERED'
    });

    // Оновлюємо щоденну статистику
    await this.updateDailyStats(userId, language, isCorrect, responseTime);

    return {
      success: true,
      wordSnapshot: this.formatFlashcard(wordSnapshot),
      xpEarned: this.calculateXP(isCorrect, responseTime, newMasteryLevel),
      masteryChanged: newMasteryLevel !== wordSnapshot.masteryLevel,
      nextReview: smResult.nextReview
    };
  }

  // Створення нової карточки
  async createFlashcard(userId: number, createDto: CreateFlashcardDto) {
    const { word, language, translation, definition } = createDto;

    // Перевіряємо, чи не існує вже така карточка
    const existing = await this.databaseService.wordSnapshot.findUnique({
      where: {
        userId_word_language: {
          userId,
          word,
          language
        }
      }
    });

    if (existing) {
      throw new BadRequestException('Flashcard already exists');
    }

    // Створюємо слово в базі (якщо не існує)
    const wordRecord = await this.databaseService.word.upsert({
      where: {
        userId_text_language: {
          userId,
          text: word,
          language
        }
      },
      create: {
        text: word,
        language,
        translate: [translation],
        definitions: definition ? [definition] : [],
        userId
      },
      update: {
        translate: {
          set: [translation, ...await this.getExistingTranslations(userId, word, language)]
        }
      }
    });

    // Створюємо карточку
    const flashcard = await this.databaseService.wordSnapshot.create({
      data: {
        userId,
        word,
        language,
        masteryLevel: 'NEW',
        difficulty: 2.5,
        reviewInterval: 1,
        nextReviewAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // завтра
        totalAttempts: 0,
        correctAttempts: 0,
      }
    });

    return {
      flashcard: this.formatFlashcard(flashcard),
      wordRecord
    };
  }

  // Статистика користувача
  async getUserStats(userId: number, language: string) {
    const stats = await this.databaseService.wordSnapshot.groupBy({
      by: ['masteryLevel'],
      where: {
        userId,
        language: language as Language
      },
      _count: {
        masteryLevel: true
      }
    });

    const totalCards = await this.databaseService.wordSnapshot.count({
      where: { userId, language: language as Language }
    });

    const dueForReview = await this.databaseService.wordSnapshot.count({
      where: {
        userId,
        language: language as Language,
        nextReviewAt: {
          lte: new Date()
        }
      }
    });

    return {
      totalCards,
      dueForReview,
      masteryBreakdown: stats.reduce((acc, stat) => {
        acc[stat.masteryLevel] = stat._count.masteryLevel;
        return acc;
      }, {} as Record<string, number>),
      weeklyProgress: await this.getWeeklyProgress(userId, language)
    };
  }

  // ПРИВАТНІ МЕТОДИ

  // Алгоритм SM-2 для spaced repetition
  private calculateSM2(currentDifficulty: number, currentInterval: number, quality: number) {
    let newDifficulty = currentDifficulty;
    let newInterval = currentInterval;

    if (quality >= 3) {
      // Правильна відповідь
      if (currentInterval === 1) {
        newInterval = 6;
      } else {
        newInterval = Math.round(currentInterval * newDifficulty);
      }
      newDifficulty = newDifficulty + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
    } else {
      // Неправильна відповідь
      newInterval = 1;
      newDifficulty = Math.max(1.3, newDifficulty - 0.2);
    }

    newDifficulty = Math.max(1.3, Math.min(2.5, newDifficulty));
    
    const nextReview = new Date();
    nextReview.setDate(nextReview.getDate() + newInterval);

    return {
      difficulty: newDifficulty,
      interval: newInterval,
      nextReview
    };
  }

  // Розрахунок рівня засвоєння слова
  private calculateMasteryLevel(correct: number, total: number, current: MasteryLevel): MasteryLevel {
    const accuracy = total > 0 ? correct / total : 0;

    if (total === 0) return 'NEW';
    if (total >= 10 && accuracy >= 0.9) return 'MASTERED';
    if (total >= 5 && accuracy >= 0.8) return 'KNOWN';
    if (total >= 3 && accuracy >= 0.6) return 'FAMILIAR';
    if (total >= 1) return 'LEARNING';
    
    return current;
  }

  // Розрахунок XP за відповідь
  private calculateXP(isCorrect: boolean, responseTime: number, masteryLevel: MasteryLevel): number {
    let baseXP = isCorrect ? 10 : 3;
    
    // Бонус за швидкість (до 5 секунд = максимальний бонус)
    const speedBonus = responseTime <= 5000 ? 5 : Math.max(0, 5 - Math.floor(responseTime / 1000));
    
    // Бонус за рівень засвоєння
    const masteryBonus = {
      'NEW': 2,
      'LEARNING': 1,
      'FAMILIAR': 0,
      'KNOWN': -1,
      'MASTERED': -2
    }[masteryLevel] || 0;

    return Math.max(1, baseXP + speedBonus + masteryBonus);
  }

  private async estimateWordCEFRLevel(word: string, language: Language): Promise<CEFRLevel> {
    const length = word.length;
    
    if (length <= 4) return 'A1';
    if (length <= 6) return 'A2';
    if (length <= 8) return 'B1';
    if (length <= 10) return 'B2';
    return 'C1';
  }

  // Форматування карточки для відповіді
  private formatFlashcard(snapshot: any) {
    return {
      id: snapshot.id,
      word: snapshot.word,
      language: snapshot.language,
      masteryLevel: snapshot.masteryLevel,
      difficulty: snapshot.difficulty,
      nextReviewAt: snapshot.nextReviewAt,
      accuracy: snapshot.totalAttempts > 0 
        ? Math.round((snapshot.correctAttempts / snapshot.totalAttempts) * 100) 
        : 0,
      totalAttempts: snapshot.totalAttempts,
      isOverdue: snapshot.nextReviewAt && new Date() > snapshot.nextReviewAt
    };
  }

  // Оновлення щоденної статистики
  private async updateDailyStats(userId: number, language: Language, isCorrect: boolean, responseTime: number) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    await this.databaseService.dailyStats.upsert({
      where: {
        userId_language_date: {
          userId,
          language,
          date: today
        }
      },
      create: {
        userId,
        language,
        date: today,
        totalXP: this.calculateXP(isCorrect, responseTime, 'LEARNING'),
        totalTime: Math.round(responseTime / 1000),
        tasksCompleted: 1,
        averageAccuracy: isCorrect ? 100 : 0,
        newWordsLearned: 0,
        wordsReviewed: 1,
        skillsStats: {
          VOCABULARY: {
            xp: this.calculateXP(isCorrect, responseTime, 'LEARNING'),
            time: Math.round(responseTime / 1000),
            correct: isCorrect ? 1 : 0,
            total: 1
          }
        }
      },
      update: {
        totalXP: {
          increment: this.calculateXP(isCorrect, responseTime, 'LEARNING')
        },
        totalTime: {
          increment: Math.round(responseTime / 1000)
        },
        tasksCompleted: {
          increment: 1
        },
        wordsReviewed: {
          increment: 1
        }
      }
    });
  }

  // Отримання часу наступного повторення
  private async getNextReviewTime(userId: number, language?: Language) {
    const where: any = { userId };
    if (language) where.language = language;

    const nextCard = await this.databaseService.wordSnapshot.findFirst({
      where: {
        ...where,
        nextReviewAt: {
          gt: new Date()
        }
      },
      orderBy: {
        nextReviewAt: 'asc'
      },
      select: {
        nextReviewAt: true
      }
    });

    return nextCard?.nextReviewAt || null;
  }

  // Тижневий прогрес
  private async getWeeklyProgress(userId: number, language: string) {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);

    const weeklyStats = await this.databaseService.dailyStats.findMany({
      where: {
        userId,
        language: language as Language,
        date: {
          gte: weekAgo
        }
      },
      orderBy: {
        date: 'asc'
      },
      select: {
        date: true,
        wordsReviewed: true,
        totalXP: true,
        averageAccuracy: true
      }
    });

    return weeklyStats;
  }

  // Отримання існуючих перекладів
  private async getExistingTranslations(userId: number, word: string, language: Language): Promise<string[]> {
    const existing = await this.databaseService.word.findUnique({
      where: {
        userId_text_language: {
          userId,
          text: word,
          language
        }
      },
      select: {
        translate: true
      }
    });

    return existing?.translate || [];
  }
}