import { Injectable } from '@nestjs/common';
import { Prisma, Role } from 'generated/prisma/client';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class UsersService {
    constructor(private readonly databaseService: DatabaseService) { }
    async createUser(createUserDto: Prisma.UserCreateInput){
        return this.databaseService.user.create({
            data: createUserDto
        })
    }

    async findAll( role? : Role){
        if (role) return this.databaseService.user.findMany({
            where: {
              role,
            }
          })
        return this.databaseService.user.findMany()
    }

    async findByEmail(email: string){
        return this.databaseService.user.findUnique({
            where: {
                email,
            }
        })
    }

    async findById(id: number){
        return this.databaseService.user.findUnique({
            where: {
                id,
            }
        })
    }

    async updateUser(id: number, updateUserDto: Prisma.UserUpdateInput) {
        return this.databaseService.user.update({
          where: {
            id,
          },
          data: updateUserDto,
        })
      }

    async deleteUser(id:number){
        return this.databaseService.user.delete({
            where:{
                id,
            }
        })
    }
}
