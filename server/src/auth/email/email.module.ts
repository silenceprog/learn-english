import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { AuthModule } from '../auth.module';
import { UsersModule } from 'src/users/users.module';


@Module({
  imports: [AuthModule, UsersModule],
  providers: [EmailService],
  exports: [EmailService]
})
export class EmailModule {}
