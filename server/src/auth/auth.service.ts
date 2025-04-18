import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs'
import { Prisma } from 'generated/prisma/client';
import { UserEntity } from 'src/users/dto/user.entity';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {

    constructor(
        private usersService: UsersService,
        private jwtService: JwtService
      ) {}
    
      async signIn(
        email: string,
        pass: string,
      ) {
        const user = await this.usersService.findByEmail(email);
        if (!user || !user.password) {
          throw new UnauthorizedException('Пользователь не найден или отсутствует пароль');
        }
      
        const passwordEquals = await bcrypt.compare(pass, user.password);
      
        if (!passwordEquals) {
          throw new UnauthorizedException('Неверный пароль');
        }
        return this.generateToken(user);
      }
    
      async registration( createUserDto: Prisma.UserCreateInput){
        const candidate = await this.usersService.findByEmail(createUserDto.email);
        if(candidate){
          throw new HttpException('Пользователь с таким емейлом уже существует',HttpStatus.BAD_REQUEST);
        }
        const hashPassword = await bcrypt.hash(createUserDto.password, 5);
        const user = await this.usersService.createUser({...createUserDto, password: hashPassword})
        return this.generateToken(user)
      }
    
      async generateToken(user: UserEntity){
        const payload = {email: user.email, id: user.id, roles: user.role}
        return {
          token: this.jwtService.sign(payload)
        }
      }
}
