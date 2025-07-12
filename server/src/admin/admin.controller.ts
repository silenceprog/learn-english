import { Controller, Delete, Get, Param, ParseIntPipe, Patch } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { Roles } from 'src/roles/roles.decorator';
import { Role } from 'generated/prisma';
import { UsersService } from 'src/users/users.service';
import { GetCurrentUserId } from 'src/decorators/get-current-user-id.decorator';

@ApiTags('Admin Panel')
@ApiBearerAuth('access-token')
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @ApiOperation({ summary: 'Видалення користувача назавжди' })
  @ApiResponse({ status: 200 })
  @Delete()
  deleteUser(@GetCurrentUserId() userId: number) {
    return this.adminService.hardDelete(userId);
  }

  @ApiOperation({ summary: 'Повернення користувача' })
  @ApiResponse({ status: 200 })
  @Patch(':id/restore')
  restore(@Param('id', ParseIntPipe) id: number) {
    return this.adminService.restore(id);
  }

  @ApiOperation({ summary: 'Отримання всіх видалених користувачів' })
  @ApiResponse({ status: 200 })
  @Get('admin/deleted')
  findDeleted() {
    return this.adminService.findDeleted();
  }

  @ApiOperation({ summary: 'Видалення користувача' })
  @ApiResponse({ status: 200 })
  @Delete()
  softDelete(@GetCurrentUserId() id: number) {
    return this.adminService.softDelete(id);
  }

  @ApiOperation({ summary: 'Статистика користувачів' })
  @ApiResponse({ status: 200 })
  @Roles(Role.ADMIN)
  @Get('/stats/users')
  getStatisticsUsers() {}

  @ApiOperation({ summary: 'Аналітика проходження завдань' })
  @ApiResponse({ status: 200 })
  @Get('/stats/tasks')
  getStatisticsTasks() {}

  @ApiOperation({ summary: 'Аналіз помилок' })
  @ApiResponse({ status: 200 })
  @Get('/stats/errors')
  getStatisticsErrors() {}

  @ApiOperation({ summary: 'Глобальні налаштування' })
  @ApiResponse({ status: 200 })
  @Roles(Role.ADMIN)
  @Get('/settings/global')
  setGlobalSettings() {}

  @ApiOperation({ summary: 'Налаштування адаптивності' })
  @ApiResponse({ status: 200 })
  @Get('/settings/adaptive')
  setAdaptiveSettings() {}

  @ApiOperation({ summary: 'Налаштування геймифікації' })
  @ApiResponse({ status: 200 })
  @Get('/settings/game')
  setGameSettings() {}
}
