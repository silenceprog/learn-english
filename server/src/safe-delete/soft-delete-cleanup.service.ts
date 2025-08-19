import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { DatabaseService } from "src/database/database.service";

@Injectable()
export class SoftDeleteCleanupService {
  private readonly logger = new Logger(SoftDeleteCleanupService.name);

  constructor(private databaseService: DatabaseService) {}

  @Cron(CronExpression.EVERY_DAY_AT_2AM)
  async cleanupSoftDeletedRecords() {
    this.logger.log('Starting soft delete cleanup job');
    
    try {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const deletedUsersCount = await this.databaseService.user.deleteMany({
        where: {
          deleteAt: {
            lte: thirtyDaysAgo,
            not: null,
          },
        },
      });

      this.logger.log(`Cleaned up ${deletedUsersCount.count} soft deleted users`);
    } catch (error) {
      this.logger.error('Error during soft delete cleanup:', error);
    }
  }


  @Cron('0 0 */7 * * *') 
  async weeklyCleanup() {
    this.logger.log('Starting weekly cleanup job');
    
    try {
      const ninetyDaysAgo = new Date();
      ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

      const result = await this.databaseService.user.deleteMany({
        where: {
          deleteAt: {
            lte: ninetyDaysAgo,
            not: null,
          },
        },
      });

      this.logger.log(`Weekly cleanup: removed ${result.count} old records`);
    } catch (error) {
      this.logger.error('Error during weekly cleanup:', error);
    }
  }
}