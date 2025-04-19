import { BadRequestException, HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs'
import { Prisma } from 'generated/prisma/client';
import { UserEntity } from 'src/users/dto/user.entity';
import { UsersService } from 'src/users/users.service';
import { AccessToken } from './types/AccessToken';

@Injectable()
export class AuthService {

    constructor(
        private usersService: UsersService,
        private jwtService: JwtService
      ) {}
    
      async signIn(
        user: UserEntity
      ) : Promise<AccessToken> {
        const payload = {email: user.email, id: user.id, roles: user.role}
        return { access_token: this.jwtService.sign(payload) };
      }
    
      async registration( createUserDto: Prisma.UserCreateInput){
        const candidate = await this.usersService.findByEmail(createUserDto.email);
        if(candidate){
          throw new HttpException('Пользователь с таким емейлом уже существует',HttpStatus.BAD_REQUEST);
        }
        const hashPassword = await bcrypt.hash(createUserDto.password, 10);
        const user = await this.usersService.createUser({...createUserDto, password: hashPassword})
        return this.signIn(user)
      }
    
      async generateToken(user: UserEntity){
        const payload = {email: user.email, id: user.id, roles: user.role}
        return {
          token: this.jwtService.sign(payload)
        }
      }

      async validateUser(user: Prisma.UserCreateInput): Promise<any> {
        const candidate = await this.usersService.findByEmail(user.email);
        if (!user) {
          throw new BadRequestException('User not found');
        }
        const isMatch: boolean = bcrypt.compareSync(user.password, candidate!.password);
        if (!isMatch) {
          throw new BadRequestException('Password does not match');
        }
        return user;
      }
}
