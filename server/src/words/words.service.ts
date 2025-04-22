import { Injectable } from '@nestjs/common';
import { UpdateWordDTO } from './dto/update-word.dto';
import { DatabaseService } from 'src/database/database.service';
import { CreateWordDto } from './dto/create-word.dto';

@Injectable()
export class WordsService {
    constructor(private readonly databaseService: DatabaseService) { }
        async createWord(createWordDto: CreateWordDto){
            return this.databaseService.word.create({
                data: createWordDto
            })
        }
    
        async findAll(){
            return this.databaseService.video.findMany()
        }
    
        async findById(id: number){
            return this.databaseService.word.findUnique({
                where: {
                    id,
                }
            })
        }
    
        async updateWord(id: number, updateWordDto: UpdateWordDTO) {
            return this.databaseService.word.update({
              where: {
                id,
              },
              data: updateWordDto,
            })
          }
    
        async deleteWord(id:number){
            return this.databaseService.word.delete({
                where:{
                    id,
                }
            })
        }
}
