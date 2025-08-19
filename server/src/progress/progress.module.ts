import { Module } from '@nestjs/common';
import { ProgressService } from './progress.service';
import { UserProgressController } from './user-progress.controller';
import { DatabaseModule } from 'src/database/database.module';
import { UserProgressService } from './user-progress.service';
import { ProgressController } from './progress.controller';

@Module({
  imports:[DatabaseModule],
  exports:[UserProgressService,ProgressService],
  providers: [UserProgressService,ProgressService],
  controllers: [UserProgressController,ProgressController]
})
export class ProgressModule {}
