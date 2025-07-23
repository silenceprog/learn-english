import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class ProgressService {
   constructor(private readonly databaseService: DatabaseService) {}

  async getWordsOverview(userId: number) {
    const setting = await this.databaseService.setting.findUnique({
      where: { userId },
    });

    if (!setting) {
      throw new NotFoundException('User settings not found');
    }

    const [total, learned, learning, todayLearned] = await Promise.all([
      this.databaseService.word.count({
        where: { userId, language: setting.current_language },
      }),
      this.databaseService.word.count({
        where: { userId, language: setting.current_language, isLearned: true },
      }),
      this.databaseService.word.count({
        where: { userId, language: setting.current_language, isLearned: false },
      }),
      this.databaseService.word.count({
        where: {
          userId,
          language: setting.current_language,
          createdAt: {
            gte: new Date(new Date().setHours(0, 0, 0, 0)),
          },
        },
      }),
    ]);

    const averageProgress = total > 0 
      ? await this.databaseService.word.aggregate({
          where: { userId, language: setting.current_language },
          _avg: { totalProgress: true },
        }).then(result => result._avg.totalProgress || 0)
      : 0;

    return {
      total,
      learned,
      learning,
      todayLearned,
      averageProgress: Math.round(averageProgress),
      completionRate: total > 0 ? Math.round((learned / total) * 100) : 0,
    };
  }

  async getDailyProgress(userId: number, days: number) {
    const setting = await this.databaseService.setting.findUnique({
      where: { userId },
    });

    if (!setting) {
      throw new NotFoundException('User settings not found');
    }

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    startDate.setHours(0, 0, 0, 0);

    const dailyStats = await this.databaseService.dailyStats.findMany({
      where: {
        userId,
        language: setting.current_language,
        date: { gte: startDate },
      },
      orderBy: { date: 'asc' },
    });

    return dailyStats.map(stat => ({
      date: stat.date,
      newWords: stat.newWordsLearned,
      wordsReviewed: stat.wordsReviewed,
      xpGained: stat.totalXP,
      timeSpent: stat.totalTime,
    }));
  }

  async getPartsOfSpeechStats(userId: number) {
    const setting = await this.databaseService.setting.findUnique({
      where: { userId },
    });

    if (!setting) {
      throw new NotFoundException('User settings not found');
    }

    const stats = await this.databaseService.word.groupBy({
      by: ['partOfSpeech'],
      where: { userId, language: setting.current_language },
      _count: true,
    });

    return stats.map(stat => ({
      partOfSpeech: stat.partOfSpeech || 'Unknown',
      count: stat._count,
    }));
  }

  async getDifficultyStats(userId: number) {
    const setting = await this.databaseService.setting.findUnique({
      where: { userId },
    });

    if (!setting) {
      throw new NotFoundException('User settings not found');
    }

    const words = await this.databaseService.word.findMany({
      where: { userId, language: setting.current_language },
      select: { totalProgress: true },
    });

    const easy = words.filter(w => w.totalProgress >= 80).length;
    const medium = words.filter(w => w.totalProgress >= 40 && w.totalProgress < 80).length;
    const hard = words.filter(w => w.totalProgress < 40).length;

    return {
      easy,
      medium,
      hard,
      total: words.length,
    };
  }

  async getMostDifficultWords(userId: number, limit: number) {
    const setting = await this.databaseService.setting.findUnique({
      where: { userId },
    });

    if (!setting) {
      throw new NotFoundException('User settings not found');
    }

    return this.databaseService.word.findMany({
      where: { userId, language: setting.current_language },
      orderBy: { totalProgress: 'asc' },
      take: limit,
    });
  }

  async getStudyRecommendations(userId: number) {
    const setting = await this.databaseService.setting.findUnique({
      where: { userId },
    });

    if (!setting) {
      throw new NotFoundException('User settings not found');
    }

    const recommendations = await this.databaseService.word.findMany({
      where: {
        userId,
        language: setting.current_language,
        isLearned: false,
        totalProgress: { lt: 70 },
      },
      orderBy: [
        { totalProgress: 'asc' },
        { createdAt: 'asc' }
      ],
      take: 20,
    });

    return recommendations.map(word => ({
      ...word,
      recommendedReason: this.getRecommendationReason(word),
      priority: this.calculatePriority(word),
    }));
  }

  async getVocabularyAchievements(userId: number) {
    const userAchievements = await this.databaseService.userAchievement.findMany({
      where: {
        userId,
        achievement: {
          type: 'VOCABULARY_GURU',
        },
      },
      include: { achievement: true },
    });

    const setting = await this.databaseService.setting.findUnique({
      where: { userId },
    });

    if (!setting) return { achievements: [], progress: {} };

    const wordsCount = await this.databaseService.word.count({
      where: { userId, language: setting.current_language, isLearned: true },
    });

    return {
      achievements: userAchievements,
      progress: {
        wordsLearned: wordsCount,
        nextMilestone: this.getNextWordMilestone(wordsCount),
      },
    };
  }

  async getLearningChart(userId: number, period: string) {
    const setting = await this.databaseService.setting.findUnique({
      where: { userId },
    });

    if (!setting) {
      throw new NotFoundException('User settings not found');
    }

    let startDate = new Date();
    let groupBy: any = { date: true };

    switch (period) {
      case 'week':
        startDate.setDate(startDate.getDate() - 7);
        break;
      case 'month':
        startDate.setMonth(startDate.getMonth() - 1);
        break;
      case 'year':
        startDate.setFullYear(startDate.getFullYear() - 1);
        break;
    }

    startDate.setHours(0, 0, 0, 0);

    const chartData = await this.databaseService.dailyStats.findMany({
      where: {
        userId,
        language: setting.current_language,
        date: { gte: startDate },
      },
      orderBy: { date: 'asc' },
    });

    return {
      period,
      data: chartData.map(item => ({
        date: item.date,
        newWords: item.newWordsLearned,
        reviewed: item.wordsReviewed,
        xp: item.totalXP,
        time: item.totalTime,
      })),
    };
  }

  private getRecommendationReason(word: any): string {
    if (word.totalProgress < 30) return 'Needs initial learning';
    if (word.totalProgress < 60) return 'Requires more practice';
    return 'Almost mastered, final review needed';
  }

  private calculatePriority(word: any): number {
    const progressFactor = (100 - word.totalProgress) / 100;
    const timeFactor = this.getTimeFactor(word.createdAt);
    return Math.round((progressFactor + timeFactor) * 5);
  }

  private getTimeFactor(createdAt: Date): number {
    const daysSince = (Date.now() - new Date(createdAt).getTime()) / (1000 * 60 * 60 * 24);
    return Math.min(daysSince / 30, 1);
  }

  private getNextWordMilestone(current: number): number {
    const milestones = [10, 25, 50, 100, 250, 500, 1000, 2500, 5000];
    return milestones.find(m => m > current) || current + 1000;
  }
}
