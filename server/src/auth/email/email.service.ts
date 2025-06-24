import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Resend } from 'resend';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class EmailService {
  private resend: Resend;

  constructor(
    private readonly jwtService: JwtService,
    private userService: UsersService,
  ) {
    this.resend = new Resend(process.env.RESEND_API_KEY);
  }

  async sendEmailConfirmation(email: string) {
    const user = await this.userService.findByEmail(email);
    if (!user) {
        throw new BadRequestException('Email not found');
    }
    const { access_token: token } = await this.generateTokenForEmail(email);

    const confirmLink = `https://learn-english-chi-nine.vercel.app/confirm-email?token=${token}`;

    await this.sendEmail(
      user.email,
      'Confirm your email',
      `<h1>Email Confirmation</h1><p>Click <a href="${confirmLink}">here</a> to confirm your email.</p>`,
    );

    return { message: 'Confirmation email sent' };
  }

  async sendPasswordResetEmail(email: string) {
    const user = await this.userService.findByEmail(email);
    if (!user) {
      return {
        message: 'If the email exists, password reset instructions were sent.',
      };
    }

    const { access_token: token } = await this.generateTokenForEmail(email);

    const resetLink = `https://learn-english-chi-nine.vercel.app/reset-password?token=${token}`;

    await this.sendEmail(
      user.email,
      'Reset your password',
      `<h1>Password Reset</h1><p>Click <a href="${resetLink}">here</a> to reset your password.</p>`,
    );

    return { message: 'Password reset email sent' };
  }

  async confirmEmail(token: string) {
    try {
      const payload = (await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET,
      })) as { id: number };

      const user = await this.userService.findById(payload.id);
      if (!user) throw new Error('User not found');

      await this.userService.updateUser(user.id, { isEmailVerified: true });

      return { message: 'Email successfully confirmed' };
    } catch (err) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }

  async resetPassword(token: string, newPassword: string) {
    try {
      const payload = (await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET,
      })) as { id: number };

      const user = await this.userService.findById(payload.id);
      if (!user) throw new Error('User not found');

      const hashed = await bcrypt.hash(newPassword, 10);
      await this.userService.updateUser(user.id, { password: hashed });

      return { message: 'Password successfully updated' };
    } catch (err) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }

  async sendEmail(to: string, subject: string, html: string) {
    try {
      const { data, error } = await this.resend.emails.send({
        from: 'Your App <noreply@yourdomain.com>',
        to,
        subject,
        html,
      });

      if (error) {
        console.error('Resend error:', error);
        throw new Error('Failed to send email');
      }

      return data;
    } catch (err) {
      console.error('Email sending failed:', err);
      throw err;
    }
  }

  private async generateTokenForEmail(email: string) {
    const user = await this.userService.findByEmail(email);
    if (!user) throw new Error('User not found');
    const payload = { id: user.id, email: user.email, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
