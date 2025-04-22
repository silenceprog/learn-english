import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TasksService {
    constructor(private readonly databaseService: DatabaseService) { }
        async createTask(createTaskDto: CreateTaskDto){
            return this.databaseService.task.create({
                data: createTaskDto
            })
        }
    
        async findAll(){
            return this.databaseService.task.findMany()
        }
    
        async findById(id: number){
            return this.databaseService.task.findUnique({
                where: {
                    id,
                }
            })
        }
    
        async updateTask(id: number, updateTaskDto: UpdateTaskDto) {
            return this.databaseService.task.update({
              where: {
                id,
              },
              data: updateTaskDto,
            })
          }
    
        async deleteTask(id:number){
            return this.databaseService.task.delete({
                where:{
                    id,
                }
            })
        }
}
