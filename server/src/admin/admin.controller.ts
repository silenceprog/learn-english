import { Controller, Get } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { Roles } from 'src/roles/roles.decorator';
import { Role } from 'generated/prisma';

@ApiTags('Admin Panel')
@ApiBearerAuth('access-token')
@Controller('admin')
export class AdminController {
    constructor(private readonly adminService:AdminService){}

    @ApiOperation({summary:"Статистика користувачів"})
    @ApiResponse({status:200})
    @Roles(Role.ADMIN)
    @Get("/stats/users")
    getStatisticsUsers(){

    }

    @ApiOperation({summary:"Аналітика проходження завдань"})
    @ApiResponse({status:200})
    @Get("/stats/tasks")
    getStatisticsTasks(){

    }

    @ApiOperation({summary:"Аналіз помилок"})
    @ApiResponse({status:200})
    @Get("/stats/errors")
    getStatisticsErrors(){
        
    }

    @ApiOperation({summary:"Глобальні налаштування"})
    @ApiResponse({status:200})
    @Roles(Role.ADMIN)
    @Get("/settings/global")
    setGlobalSettings(){

    }

    @ApiOperation({summary:"Налаштування адаптивності"})
    @ApiResponse({status:200})
    @Get("/settings/adaptive")
    setAdaptiveSettings(){

    }

    @ApiOperation({summary:"Налаштування геймифікації"})
    @ApiResponse({status:200})
    @Get("/settings/game")
    setGameSettings(){
        
    }
}
