import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { SoftDeleteCleanupService } from './soft-delete-cleanup.service';
import { DatabaseModule } from 'src/database/database.module';


@Module({
  imports: [
    ScheduleModule.forRoot(),
    DatabaseModule,
  ],
  providers: [SoftDeleteCleanupService],
})
export class CronModule {}