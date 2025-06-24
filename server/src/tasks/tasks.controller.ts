import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  Req,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/roles/roles.decorator';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Public } from 'src/auth/public.decorator';
import { TaskEntity } from './dto/task.entity';
import { Language, Role } from 'generated/prisma';

@Public()
@ApiTags('Tasks')
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @ApiOperation({ summary: 'Створення завдання' })
  @ApiResponse({ status: 201, type: CreateTaskDto })
  @Roles(Role.ADMIN)
  @Post()
  createTask(@Body() createTaskDTO: CreateTaskDto) {
    return this.tasksService.createTask(createTaskDTO);
  }

  @ApiOperation({ summary: 'Отримання всіх завдань' })
  @ApiResponse({ status: 200, type: TaskEntity })
  @Get()
  findAll() {
    return this.tasksService.findAll();
  }

  @ApiOperation({ summary: 'Отримання завдання по айді' })
  @ApiResponse({ status: 200, type: TaskEntity })
  @Get(':id')
  findById(@Param('id', ParseIntPipe) id: number) {
    return this.tasksService.findById(id);
  }

  @Get('by-language/:lang')
  @ApiOperation({ summary: 'Отримати завдання за мовою' })
  getByLanguage(@Param('lang') lang: Language,@Req() req) {
     const userId = req.user.id;
    return this.tasksService.getTasksByLanguage(userId,lang);
  }

  @Get('by-language')
  @ApiOperation({
    summary: 'Отримати завдання за поточними налаштуваннями мови користувача',
  })
  getTasksByUser(@Req() req) {
     const userId = req.user.id;
    return this.tasksService.getTasksByUserLanguage(userId);
  }

  @ApiOperation({ summary: 'Оновлення інформації про завдання' })
  @ApiResponse({ status: 200, type: UpdateTaskDto })
  @Roles(Role.ADMIN)
  @Patch(':id')
  updateTask(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTaskDto: UpdateTaskDto,
  ) {
    return this.tasksService.updateTask(id, updateTaskDto);
  }

  @ApiOperation({ summary: 'Видалення завдання' })
  @ApiResponse({ status: 200 })
  @Roles(Role.ADMIN)
  @Delete(':id')
  deleteTask(@Param('id', ParseIntPipe) id: number) {
    return this.tasksService.deleteTask(id);
  }
}
