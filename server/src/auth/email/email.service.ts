import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as nodemailer from 'nodemailer';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcryptjs';
import { ChangePassword } from '../dto/change-password.dto';
import { EmailSend } from '../dto/email-send';
import { ConfigService } from '@nestjs/config';
import { EmailSendDTO } from '../dto/email.dto';

@Injectable()
export class EmailService {
  constructor(
    private readonly jwtService: JwtService,
    private userService: UsersService,
    private configService: ConfigService,
    
  ) {}

  async sendEmailConfirmation(emailSend: EmailSend) {
    const {email} = emailSend;
    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new BadRequestException('Email not found');
    }
    const { access_token: token } = await this.generateTokenForEmail(email);

    const confirmLink = `${this.configService.get<string>('FRONTEND_URL')}/confirm-email?token=${token}`;

    const mailOptions = {
      to: user.email,
      subject: 'Confirm your email',
      html: ` <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Confirm email</h2>
          <p>Click the link below to confirm your email:</p>
          <a href="${confirmLink}" style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px;">
            Confirm email
          </a>
          <p style="color: #666;">
            The link is valid for 1 hour.
          </p>
        </div>`,
    };

   try {
      await this.sendEmail(mailOptions);
      console.log('Email sent successfully');
    } catch (error) {
      console.error('Error sending email:', error);
      throw new Error('Failed to send email');
    }
  }

  async sendPasswordResetEmail(forgotPassword: EmailSend) {
    const { email } = forgotPassword;
    const user = await this.userService.findByEmail(email);
    if (!user) {
      return {
        message: 'If the email exists, password reset instructions were sent.',
      };
    }

    const { access_token: token } = await this.generateTokenForEmail(email);

    const resetLink = `${this.configService.get<string>('FRONTEND_URL')}/reset-password?token=${token}`;

    await this.sendEmail({
      to: user.email,
      subject: 'Reset your password',
      html: ` 
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Password recovery</h2>
          <p>You have requested a password recovery for your account.</p>
          <p>Click the link below to create a new password:</p>
          <a href="${resetLink}" style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px;">
            Recover password
          </a>
          <p style="margin-top: 20px; color: #666;">
           If you did not request a password reset, simply ignore this email.
          </p>
          <p style="color: #666;">
            The link is valid for 1 hour.
          </p>
        </div>`,
    });

    return { message: 'Password reset email sent' };
  }

  async changePassword(userId, changePassword: ChangePassword) {
    const user = await this.userService.findById(userId);
    if (!user) {
      throw new BadRequestException('User not found');
    }
    const { oldPassword, newPassword } = changePassword;
    const passwordMatch = await bcrypt.compare(oldPassword, user.password);
    if (!passwordMatch) {
      throw new BadRequestException('Wrong password');
    }
    const hashPassword = await bcrypt.hash(newPassword, 10);
    return this.userService.updateUser(userId, {
      password: hashPassword,
    });
  }

  async confirmEmail(token: string) {
    try {
      const payload = (await this.jwtService.verifyAsync(token, {
        secret: this.configService.get<string>("JWT_SECRET"),
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
        secret: this.configService.get<string>("JWT_SECRET"),
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

  private emailTransport(): nodemailer.Transporter {
     const transporter = nodemailer.createTransport({
     service: 'gmail',
      secure: false,
      auth: {
        user: this.configService.get<string>('EMAIL_USER'),
        pass: this.configService.get<string>('EMAIL_PASSWORD'),
      },
    });
    return transporter;
  }

  async sendEmail(emailSendDTO: EmailSendDTO) {
    const { to, subject, html } = emailSendDTO;
    const transport = this.emailTransport();
    const options: nodemailer.SendMailOptions = {
      from: this.configService.get<string>('EMAIL_USER'),
      to,
      subject,
      html,
    };
    try {
      await transport.sendMail(options);
      console.log('Email sent successufully');
    } catch (error) {
      console.log('Error sending mail:' + error);
    }
  }

  private async generateTokenForEmail(email: string) {
    const user = await this.userService.findByEmail(email);
    if (!user) throw new Error('User not found');
    const payload = { id: user.id, email: user.email, role: user.role };
    return {
      access_token: this.jwtService.sign(payload, { expiresIn: '1h',
      secret: this.configService.get<string>('JWT_SECRET') }),
    };
  }
}
