import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UsersService } from 'src/users/users.service';
import { AccessToken } from './types/AccessToken';
import { LoginUserDto } from './dto/login-user.dto';
import { CreateUserDto } from 'src/users/dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  
  async login(userDto: LoginUserDto): Promise<AccessToken> {
    const user = await this.usersService.findByEmail(userDto.email);
    return this.generateToken(user)
   
  }

  async registration(createUserDto: CreateUserDto) {
    const candidate = await this.usersService.findByEmail(createUserDto.email);
    if (candidate) {
      throw new HttpException(
        'A user with this email already exists',
        HttpStatus.BAD_REQUEST,
      );
    }
    const hashPassword = await bcrypt.hash(createUserDto.password, 10);
    const user = await this.usersService.createUser({
      ...createUserDto,
      password: hashPassword,
    });
    return this.login(user);
  }

  async validateUser(userDto: LoginUserDto) {
    const user = await this.usersService.findByEmail(userDto.email);
    if (!userDto.email) {
      throw new BadRequestException('Email is required');
  }
    if (!user) throw new BadRequestException('User not found');

    const passwordValid = await bcrypt.compare(userDto.password, user.password);
    if (!passwordValid)
      throw new BadRequestException('Password does not match');

    return user;
  }

  private async generateToken(user) : Promise<AccessToken> {
    const payload = {email: user.email, id: user.id,username:user.username, role: user.role}
    return {
        access_token: this.jwtService.sign(payload),user_role:user.role
    }
}
}
