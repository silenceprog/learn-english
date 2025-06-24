import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags("Courses")
@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @ApiOperation({summary:"Створити курс"})
  @ApiResponse({status:201, type:CreateCourseDto})
  @Post()
  create(@Body() createCourseDto: CreateCourseDto) {
    return this.coursesService.create(createCourseDto);
  }

  @ApiOperation({summary:"Вивести всі курси"})
  @ApiResponse({status:200})
  @Get()
  findAll() {
    return this.coursesService.findAll();
  }

  @ApiOperation({summary:"Знайти курс по айді"})
  @ApiResponse({status:200})
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.coursesService.findOne(+id);
  }

  @ApiOperation({summary:"Оновити курс"})
  @ApiResponse({status:200, type:UpdateCourseDto})
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCourseDto: UpdateCourseDto) {
    return this.coursesService.update(+id, updateCourseDto);
  }

  @ApiOperation({summary:"Видалити курс"})
  @ApiResponse({status:200})
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.coursesService.remove(+id);
  }
}
