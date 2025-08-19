import { Injectable } from '@nestjs/common';
import { CEFRLevel, Purpose, Role } from 'generated/prisma/client';
import { DatabaseService } from 'src/database/database.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly databaseService: DatabaseService) {}
  async createUser(createUserDto: CreateUserDto) {
    return this.databaseService.user.create({
      data: {
        email: createUserDto.email,
        username: createUserDto.username,
        password: createUserDto.password,
        setting: {
          create: {
            global_language: 'UA',
            current_language: 'EN',
            purposes: [Purpose.NONE],
            current_level: CEFRLevel.PRE_A1,
          },
        },
      },
      include: {
        setting: true,
      },
    });
  }

  async findAll(role?: Role) {
    if (role)
      return this.databaseService.user.findMany({
        where: {
          role,
          deleteAt: null
        },
      });
    return this.databaseService.user.findMany();
  }

  async findByEmail(email: string) {
    if (!email) {
      throw new Error('Email must be provided');
    }
    return this.databaseService.user.findUnique({
      where: {
        email,
        deleteAt: null
      },
      select: {
        id: true,
        email: true,
        password: true,
        role: true,
      },
    });
  }

  async findById(id: number) {
    return this.databaseService.user.findUnique({
      where: {
        id,
        deleteAt: null
      }
    });
  }

  async updateUser(id: number, updateUserDto: UpdateUserDto) {
    return this.databaseService.user.update({
      where: {
        id,
      },
      data: updateUserDto,
    });
  }

   async updateRefreshToken(userId: number, refreshToken: string | null): Promise<void> {
    await this.databaseService.user.update({
      where: { id: userId },
      data: { refreshToken },
    });
  }

  async hardDelete(id: number) {
    return this.databaseService.user.delete({
      where: {
        id,
      },
    });
  }

   async softDelete(id: number) {
    return this.databaseService.user.update({
      where: { id },
      data: {
        deleteAt: new Date(),
      },
    });
  }

}
