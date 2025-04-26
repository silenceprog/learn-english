import { Injectable } from '@nestjs/common';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class CoursesService {
  constructor(private readonly databaseService: DatabaseService){}
  create(createCourseDto: CreateCourseDto) {
    return this.databaseService.course.create({
      data:createCourseDto
    })
  }

  findAll() {
    return this.databaseService.course.findMany()
  }

  findOne(id: number) {
    return this.databaseService.user.findUnique({
      where: {
          id,
      }
  })
  }

  update(id: number, updateCourseDto: UpdateCourseDto) {
    return this.databaseService.user.update({
      where: {
        id,
      },
      data: updateCourseDto,
    })
  }

  remove(id: number) {
    return this.databaseService.user.delete({
      where: {
          id,
      }
  })
  }
}
