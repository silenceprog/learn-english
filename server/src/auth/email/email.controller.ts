import { Body, Controller, Patch, Post, Req } from '@nestjs/common';
import { EmailService } from './email.service';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ChangePassword } from '../dto/change-password.dto';
import { Public } from '../public.decorator';
import { EmailSend } from '../dto/email-send';

@ApiBearerAuth('access-token')
@ApiTags('Email')
@Controller('email')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}
  @Public()
  @Post('send-email')
  @ApiOperation({ summary: 'Надсилання на email токен' })
  @ApiBody({ schema: { example: { email: 'forgot@gmail.com' } } })
  @ApiResponse({ status: 200, description: 'Повідомлення на email відправлено' })
  async sendEmailConfirmation(@Body() confirmEmail:EmailSend ) {
    return this.emailService.sendEmailConfirmation(confirmEmail);
  }

  @Public()
  @Patch('confirm-email')
  @ApiOperation({ summary: 'Підтвердження email за токеном' })
  @ApiBody({ schema: { example: { token: 'jwt_token_string' } } })
  @ApiResponse({ status: 200, description: 'Email підтверджено' })
  async confirmEmail(@Body('token') token: string) {
    return this.emailService.confirmEmail(token);
  }

  @Public()
  @Post('forgot-password')
  @ApiOperation({ summary: 'Запит на скидання паролю' })
  @ApiBody({ type: EmailSend })
  @ApiResponse({
    status: 200,
    description: 'Лист на скидання пароля надіслано',
  })
  async forgotPassword(@Body() forgotPasswordDto: EmailSend) {
    return this.emailService.sendPasswordResetEmail(forgotPasswordDto);
  }

  @Public()
  @Patch('reset-password')
  @ApiOperation({ summary: 'Скидання пароля' })
  @ApiBody({
    schema: {
      example: {
        token: 'reset_token_string',
        newPassword: 'new_secure_password'
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Пароль успішно оновлено' })
  async resetPassword(
    @Body('token') token: string,
    @Body('newPassword') newPassword: string,
  ) {
    return this.emailService.resetPassword(token, newPassword);
  }

  @Patch('change-password')
  @ApiOperation({ summary: 'Зміна паролю' })
  @ApiBody({
    schema: {
      example: {
        oldPassword: 'old_secure_password',
        newPassword: 'new_secure_password',
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Пароль успішно оновлено' })
  async changePassword(@Req() req, @Body() changePassword: ChangePassword) {
    const userId = req.user.id;
    return this.emailService.changePassword(userId, changePassword);
  }
}
