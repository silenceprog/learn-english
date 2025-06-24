import { Body, Controller, Post } from '@nestjs/common';
import { EmailService } from './email.service';

@Controller('email')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}
  @Post('confirm-email')
  async confirmEmail(@Body('token') token: string) {
    return this.emailService.confirmEmail(token);
  }

  @Post('forgot-password')
  async forgotPassword(@Body('email') email: string) {
    return this.emailService.sendPasswordResetEmail(email);
  }

  @Post('reset-password')
  async resetPassword(
    @Body('token') token: string,
    @Body('newPassword') newPassword: string,
  ) {
    return this.emailService.resetPassword(token, newPassword);
  }
}
