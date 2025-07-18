import { Injectable } from '@nestjs/common';
import { WordTaskType } from 'generated/prisma';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class ProgressService {
    constructor(private readonly databaseService: DatabaseService){}
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
}
