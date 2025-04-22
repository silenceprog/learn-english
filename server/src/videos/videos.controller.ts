import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/roles/roles.decorator';
import { CreateVideoDto } from './dto/create-video.dto';
import { VideosService } from './videos.service';
import { UpdateVideoDTO } from './dto/update-video.dto';
import { Public } from 'src/auth/public.decorator';
import { VideoEntity } from './dto/video.entity';
import { Role } from 'generated/prisma';

@Public()
@ApiTags('Videos')
@Controller('videos')
export class VideosController {
    constructor(private readonly videoService: VideosService) {}
    
      
      @ApiOperation({ summary: 'Створення відео' })
      @ApiResponse({ status: 201, type: CreateVideoDto })
      @Roles(Role.ADMIN)
      @Post()
      createVideo(@Body() createVideoDTO: CreateVideoDto) {
        return this.videoService.createVideo(createVideoDTO);
      }
    
      @ApiOperation({ summary: 'Отримання всіх відео' })
      @ApiResponse({ status: 200, type: VideoEntity })
      @Get()
      findAll() {
        return this.videoService.findAll();
      }
    
      @ApiOperation({ summary: 'Отримання відео по айді' })
      @ApiResponse({ status: 200, type: VideoEntity })
      @Roles(Role.ADMIN)
      @Get(':id')
      findById(@Param('id', ParseIntPipe) id: number) {
        return this.videoService.findById(id);
      }
    
      @ApiOperation({ summary: 'Оновлення інформації про відео' })
      @ApiResponse({ status: 200, type: UpdateVideoDTO })
      @Roles(Role.ADMIN)
      @Patch(':id')
      updateVideo(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateVideoDto: UpdateVideoDTO,
      ) {
        return this.videoService.updateVideo(id, updateVideoDto);
      }
    
      @ApiOperation({ summary: 'Видалення відео' })
      @ApiResponse({ status: 200 })
      @Roles(Role.ADMIN)
      @Delete(':id')
      deleteVideo(@Param('id', ParseIntPipe) id: number) {
        return this.videoService.deleteVideo(id);
      }
}
