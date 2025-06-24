import { Injectable } from '@nestjs/common';
import { UpdateVideoDTO } from './dto/update-video.dto';
import { CreateVideoDto } from './dto/create-video.dto';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class VideosService {
     constructor(private readonly databaseService: DatabaseService) { }
        async createVideo(createVideoDto: CreateVideoDto){
            return this.databaseService.video.create({
                data: createVideoDto
            })
        }
    
        async findAll(){
            return this.databaseService.video.findMany()
        }
    
        async findById(id: number){
            return this.databaseService.video.findUnique({
                where: {
                    id,
                }
            })
        }
    
        async updateVideo(id: number, updateVideoDto: UpdateVideoDTO) {
            return this.databaseService.video.update({
              where: {
                id,
              },
              data: updateVideoDto,
            })
          }
    
        async deleteVideo(id:number){
            return this.databaseService.video.delete({
                where:{
                    id,
                }
            })
        }
}
