import { Injectable, NotFoundException } from '@nestjs/common';
import { CEFRLevel, CoreSkillType, Language } from 'generated/prisma';
import { DatabaseService } from 'src/database/database.service';

interface SkillUpdateData {
  isCorrect: boolean;
  xpEarned: number;
  timeSpent: number;
  wordLearned?: boolean;
}

interface Recommendation {
  type: 'FOCUS_SKILL' | 'REVIEW_CARDS';
  skillType?: CoreSkillType;
  count?: number;
  message: string;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
}

@Injectable()
export class ProgressService {
   constructor(private readonly databaseService: DatabaseService) {}

   async updateSkillProgress(
    userId: number, 
    language: Language, 
    skillType: CoreSkillType, 
    updateData: SkillUpdateData
  ) {
    const { isCorrect, xpEarned, timeSpent, wordLearned = false } = updateData;

    const languageProgress = await this.getOrCreateLanguageProgress(userId, language);

    let skillProgress = await this.databaseService.skillProgress.findUnique({
      where: {
        userId_languageProgressId_skillType: {
          userId,
          languageProgressId: languageProgress.id,
          skillType
        }
      }
    });

    if (!skillProgress) {
      skillProgress = await this.databaseService.skillProgress.create({
        data: {
          userId,
          languageProgressId: languageProgress.id,
          skillType,
          cefrLevel: 'PRE_A1',
          levelProgress: 0.0,
        }
      });
    }

    const updatedStats = {
      totalPracticed: skillProgress.totalPracticed + 1,
      totalAnswers: skillProgress.totalAnswers + 1,
      correctAnswers: skillProgress.correctAnswers + (isCorrect ? 1 : 0),
      xpEarned: skillProgress.xpEarned + xpEarned,
      timeSpent: skillProgress.timeSpent + timeSpent,
      totalWordsStudied: skillProgress.totalWordsStudied,
      wordsLearned: skillProgress.wordsLearned,
      currentAccuracy: 0, 
      cefrLevel: skillProgress.cefrLevel,
      levelProgress: skillProgress.levelProgress,
    };

    if (skillType === 'VOCABULARY') {
      updatedStats.totalWordsStudied = skillProgress.totalWordsStudied + 1;
      if (wordLearned) {
        updatedStats.wordsLearned = skillProgress.wordsLearned + 1;
      }
    }

    updatedStats.currentAccuracy = 
      (updatedStats.correctAnswers / updatedStats.totalAnswers) * 100;

    const levelCheck = await this.checkLevelUp(skillProgress.cefrLevel, skillType, updatedStats);

    if (levelCheck.canLevelUp && levelCheck.newLevel) {
      updatedStats.cefrLevel = levelCheck.newLevel;
      updatedStats.levelProgress = 0.0;
      
      await this.createLevelUpAchievement(userId, skillType, levelCheck.newLevel);
    } else {
      updatedStats.levelProgress = levelCheck.progress;
    }

    skillProgress = await this.databaseService.skillProgress.update({
      where: { id: skillProgress.id },
      data: {
        ...updatedStats,
        lastPracticed: new Date(),
        updatedAt: new Date(),
      }
    });

    await this.updateOverallLanguageProgress(userId, language);

    await this.updateUserTotalXP(userId, xpEarned);

    return skillProgress;
  }

  private async getOrCreateLanguageProgress(userId: number, language: Language) {
    return await this.databaseService.languageProgress.upsert({
      where: {
        userId_language: {
          userId,
          language
        }
      },
      create: {
        userId,
        language,
        overallCEFR: 'PRE_A1',
        overallProgress: 0.0,
      },
      update: {
        lastActiveAt: new Date(),
        updatedAt: new Date(),
      }
    });
  }

  private async checkLevelUp(currentLevel: CEFRLevel, skillType: CoreSkillType, stats: any): Promise<{
    canLevelUp: boolean;
    progress: number;
    newLevel?: CEFRLevel;
  }> {
    const nextLevel = this.getNextCEFRLevel(currentLevel);
    if (!nextLevel) {
      return { canLevelUp: false, progress: 100.0 };
    }

    const requirements = await this.databaseService.skillLevelRequirements.findUnique({
      where: {
        skillType_cefrLevel: {
          skillType,
          cefrLevel: nextLevel
        }
      }
    });

    if (!requirements) {
      await this.createDefaultRequirements(skillType, nextLevel);
      return { canLevelUp: false, progress: 0.0 };
    }

    const checks = {
      xp: stats.xpEarned >= requirements.minXP,
      accuracy: stats.currentAccuracy >= requirements.minAccuracy,
      practiced: stats.totalPracticed >= requirements.minPracticed,
      time: stats.timeSpent >= requirements.minTimeSpent,
      words: !requirements.minWordsLearned || stats.wordsLearned >= requirements.minWordsLearned
    };

    const canLevelUp = Object.values(checks).every(check => check);

    if (canLevelUp) {
      return { canLevelUp: true, newLevel: nextLevel, progress: 100.0 };
    }

    const progress = this.calculateLevelProgress(requirements, stats);
    return { canLevelUp: false, progress };
  }

  private calculateLevelProgress(requirements: any, stats: any): number {
    const factors: number[] = [];

    if (requirements.minXP > 0) {
      factors.push(Math.min(100, (stats.xpEarned / requirements.minXP) * 100));
    }

    if (requirements.minAccuracy > 0) {
      factors.push(Math.min(100, (stats.currentAccuracy / requirements.minAccuracy) * 100));
    }

    if (requirements.minPracticed > 0) {
      factors.push(Math.min(100, (stats.totalPracticed / requirements.minPracticed) * 100));
    }

    if (requirements.minTimeSpent > 0) {
      factors.push(Math.min(100, (stats.timeSpent / requirements.minTimeSpent) * 100));
    }

    if (requirements.minWordsLearned > 0) {
      factors.push(Math.min(100, (stats.wordsLearned / requirements.minWordsLearned) * 100));
    }

    return factors.length > 0 ? Math.round(factors.reduce((a, b) => a + b) / factors.length) : 0;
  }

  private async updateOverallLanguageProgress(userId: number, language: Language) {
    const skillProgresses = await this.databaseService.skillProgress.findMany({
      where: {
        userId,
        languageProgress: {
          language
        }
      }
    });

    if (skillProgresses.length === 0) return;

    const overallResult = this.calculateOverallCEFR(skillProgresses);

    const totalXP = skillProgresses.reduce((sum, skill) => sum + skill.xpEarned, 0);
    const totalTime = skillProgresses.reduce((sum, skill) => sum + skill.timeSpent, 0);

    await this.databaseService.languageProgress.update({
      where: {
        userId_language: {
          userId,
          language
        }
      },
      data: {
        overallProgress: overallResult.progress,
        totalXP,
        totalTime,
        lastActiveAt: new Date(),
        updatedAt: new Date()
      }
    });

    return overallResult;
  }

  private calculateOverallCEFR(skillProgresses: any[]) {
    const skillWeights = {
      'VOCABULARY': 0.25, 
      'READING': 0.20,
      'LISTENING': 0.20,
      'SPEAKING': 0.20,
      'WRITING': 0.15
    } as const;

    let totalWeightedScore = 0;
    let totalWeight = 0;

    skillProgresses.forEach(skill => {
      const numericLevel = this.cefrToNumeric(skill.cefrLevel);
      const progressBonus = skill.levelProgress / 100; // 0-1
      const skillScore = numericLevel + progressBonus;
      
      const weight = skillWeights[skill.skillType as keyof typeof skillWeights] || 0.2;
      totalWeightedScore += skillScore * weight;
      totalWeight += weight;
    });

    if (totalWeight === 0) {
      return { cefrLevel: 'PRE_A1' as CEFRLevel, progress: 0.0 };
    }

    const averageScore = totalWeightedScore / totalWeight;
    const baseLevel = Math.floor(averageScore);
    const progress = (averageScore - baseLevel) * 100;

    return {
      cefrLevel: this.numericToCEFR(baseLevel),
      progress: Math.round(progress * 10) / 10
    };
  }

  private cefrToNumeric(cefrLevel: CEFRLevel): number {
    const levels = {
      'PRE_A1': 0, 'A1_MINUS': 1, 'A1': 2, 'A1_PLUS': 3,
      'A2_MINUS': 4, 'A2': 5, 'A2_PLUS': 6,
      'B1_MINUS': 7, 'B1': 8, 'B1_PLUS': 9,
      'B2_MINUS': 10, 'B2': 11, 'B2_PLUS': 12,
      'C1_MINUS': 13, 'C1': 14, 'C1_PLUS': 15,
      'C2': 16, 'NATIVE': 17
    } as const;
    return levels[cefrLevel] || 0;
  }

  private numericToCEFR(numeric: number): CEFRLevel {
    const levels = [
      'PRE_A1', 'A1_MINUS', 'A1', 'A1_PLUS',
      'A2_MINUS', 'A2', 'A2_PLUS',
      'B1_MINUS', 'B1', 'B1_PLUS',
      'B2_MINUS', 'B2', 'B2_PLUS',
      'C1_MINUS', 'C1', 'C1_PLUS', 'C2', 'NATIVE'
    ] as const;
    return levels[Math.floor(numeric)] as CEFRLevel || 'PRE_A1';
  }

  private getNextCEFRLevel(currentLevel: CEFRLevel): CEFRLevel | null {
    const levels = [
      'PRE_A1', 'A1_MINUS', 'A1', 'A1_PLUS',
      'A2_MINUS', 'A2', 'A2_PLUS',
      'B1_MINUS', 'B1', 'B1_PLUS',
      'B2_MINUS', 'B2', 'B2_PLUS',
      'C1_MINUS', 'C1', 'C1_PLUS', 'C2', 'NATIVE'
    ] as const;
    
    const currentIndex = levels.indexOf(currentLevel);
    return currentIndex < levels.length - 1 ? levels[currentIndex + 1] as CEFRLevel : null;
  }

  private async createDefaultRequirements(skillType: CoreSkillType, cefrLevel: CEFRLevel) {
    const baseRequirements = this.getBaseRequirements(skillType, cefrLevel);
    
    await this.databaseService.skillLevelRequirements.create({
      data: {
        skillType,
        cefrLevel,
        ...baseRequirements
      }
    });
  }

  private getBaseRequirements(skillType: CoreSkillType, cefrLevel: CEFRLevel) {
    const levelMultiplier = this.cefrToNumeric(cefrLevel) + 1;
    
    const base = {
      'VOCABULARY': {
        minXP: 100 * levelMultiplier,
        minAccuracy: 60 + (levelMultiplier * 2),
        minPracticed: 20 * levelMultiplier,
        minTimeSpent: 1800 * levelMultiplier, // 30 хв * рівень
        minWordsLearned: 50 * levelMultiplier,
        weightInOverall: 0.25,
        displayName: `${cefrLevel} Vocabulary`,
        description: `Vocabulary skills at ${cefrLevel} level`,
        color: '#4CAF50'
      },
      'READING': {
        minXP: 80 * levelMultiplier,
        minAccuracy: 65 + (levelMultiplier * 2),
        minPracticed: 15 * levelMultiplier,
        minTimeSpent: 1200 * levelMultiplier,
        minWordsLearned: null,
        weightInOverall: 0.20,
        displayName: `${cefrLevel} Reading`,
        description: `Reading skills at ${cefrLevel} level`,
        color: '#2196F3'
      },
      'LISTENING': {
        minXP: 80 * levelMultiplier,
        minAccuracy: 60 + (levelMultiplier * 2),
        minPracticed: 15 * levelMultiplier,
        minTimeSpent: 1200 * levelMultiplier,
        minWordsLearned: null,
        weightInOverall: 0.20,
        displayName: `${cefrLevel} Listening`,
        description: `Listening skills at ${cefrLevel} level`,
        color: '#FF9800'
      },
      'SPEAKING': {
        minXP: 70 * levelMultiplier,
        minAccuracy: 55 + (levelMultiplier * 2),
        minPracticed: 10 * levelMultiplier,
        minTimeSpent: 900 * levelMultiplier,
        minWordsLearned: null,
        weightInOverall: 0.20,
        displayName: `${cefrLevel} Speaking`,
        description: `Speaking skills at ${cefrLevel} level`,
        color: '#E91E63'
      },
      'WRITING': {
        minXP: 60 * levelMultiplier,
        minAccuracy: 70 + (levelMultiplier * 2),
        minPracticed: 10 * levelMultiplier,
        minTimeSpent: 1500 * levelMultiplier,
        minWordsLearned: null,
        weightInOverall: 0.15,
        displayName: `${cefrLevel} Writing`,
        description: `Writing skills at ${cefrLevel} level`,
        color: '#9C27B0'
      }
    } as const;

    return base[skillType] || base['VOCABULARY'];
  }

  private async createLevelUpAchievement(userId: number, skillType: CoreSkillType, newLevel: CEFRLevel) {
    let achievement = await this.databaseService.achievement.findFirst({
      where: {
        type: 'SKILL_LEVEL',
        requiredSkill: skillType,
        requiredLevel: newLevel
      }
    });

    if (!achievement) {
      achievement = await this.databaseService.achievement.create({
        data: {
          name: `${skillType} ${newLevel} Master`,
          description: `Reached ${newLevel} level in ${skillType}`,
          type: 'SKILL_LEVEL',
          requiredSkill: skillType,
          requiredLevel: newLevel,
          xpReward: this.cefrToNumeric(newLevel) * 50,
          badge: `${skillType.toLowerCase()}_${newLevel.toLowerCase()}`,
          isActive: true
        }
      });
    }

    await this.databaseService.userAchievement.upsert({
      where: {
        userId_achievementId: {
          userId,
          achievementId: achievement.id
        }
      },
      create: {
        userId,
        achievementId: achievement.id
      },
      update: {}
    });

    return achievement;
  }

  private async updateUserTotalXP(userId: number, xpEarned: number) {
    await this.databaseService.user.update({
      where: { id: userId },
      data: {
        totalXP: {
          increment: xpEarned
        },
        lastActiveAt: new Date()
      }
    });
  }

  async getLanguageProgress(userId: number, language: Language) {
    const languageProgress = await this.databaseService.languageProgress.findUnique({
      where: {
        userId_language: {
          userId,
          language
        }
      },
      include: {
        skillProgresses: true
      }
    });

    if (!languageProgress) {
      return null;
    }

    return {
      ...languageProgress,
      skillBreakdown: languageProgress.skillProgresses.map(skill => ({
        skillType: skill.skillType,
        cefrLevel: skill.cefrLevel,
        levelProgress: skill.levelProgress,
        xpEarned: skill.xpEarned,
        currentAccuracy: skill.currentAccuracy,
        lastPracticed: skill.lastPracticed
      }))
    };
  }

  async getLearningRecommendations(userId: number, language: Language) {
    const languageProgress = await this.getLanguageProgress(userId, language);
    
    if (!languageProgress) {
      return {
        message: 'Start learning to get recommendations',
        recommendations: []
      };
    }

    const recommendations: Recommendation[] = [];
    
    const weakestSkill = languageProgress.skillBreakdown
      .sort((a, b) => this.cefrToNumeric(a.cefrLevel) - this.cefrToNumeric(b.cefrLevel))[0];

    if (weakestSkill) {
      recommendations.push({
        type: 'FOCUS_SKILL',
        skillType: weakestSkill.skillType,
        message: `Focus on ${weakestSkill.skillType} - it's your weakest skill`,
        priority: 'HIGH'
      });
    }
    
    return {
      overallLevel: languageProgress.overallCEFR,
      recommendations
    };
  }
}