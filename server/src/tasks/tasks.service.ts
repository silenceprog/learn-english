import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Language } from 'generated/prisma';

@Injectable()
export class TasksService {
  constructor(private readonly databaseService: DatabaseService) {}
  async createTask(createTaskDto: CreateTaskDto) {
    return this.databaseService.task.create({
      data: createTaskDto,
    });
  }

  async findAll() {
    return this.databaseService.task.findMany();
  }

  async findById(id: number) {
    return this.databaseService.task.findUnique({
      where: {
        id,
      },
    });
  }

  async getTasksByLanguage(userId: number,language: Language) {
    return this.databaseService.task.findMany({
      where: { language },
    });
  }

   async getTasksByUserLanguage(userId: number) {
    const setting = await this.databaseService.setting.findUnique({
      where: { userId },
    });

    if (!setting) {
    throw new NotFoundException('User settings not found');
    }

    return this.databaseService.word.findMany({
      where: {
        language: setting?.current_language,
      },
    });
  }

  async updateTask(id: number, updateTaskDto: UpdateTaskDto) {
    return this.databaseService.task.update({
      where: {
        id,
      },
      data: updateTaskDto,
    });
  }

  async deleteTask(id: number) {
    return this.databaseService.task.delete({
      where: {
        id,
      },
    });
  }
}
