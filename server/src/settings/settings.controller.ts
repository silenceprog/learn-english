import {
  Controller,
  Get,
  Body,
  Patch,
  Req,
} from '@nestjs/common';
import { SettingsService } from './settings.service';
import { CreateSettingDto } from './dto/create-setting.dto';
import { UpdateSettingDto } from './dto/update-setting.dto';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { NoCache } from 'src/no-cache.decorator';

@ApiBearerAuth('access-token')
@Controller('settings')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @ApiOperation({ summary: 'Отримання налаштувань користувача по айді' })
  @ApiResponse({ status: 200, type: CreateSettingDto })
  @NoCache()
  @Get()
  findById(@Req() req) {
    const userId = req.user.id;
    console.log(req.user.id);
    return this.settingsService.findById(userId);
  }

  @ApiOperation({ summary: 'Оновлення налашувань користувача' })
  @ApiResponse({ status: 200, type: UpdateSettingDto })
  @Patch()
  update(@Req() req, @Body() updateSettingDto: UpdateSettingDto) {
    const userId = req.user.id;
    return this.settingsService.update(userId, updateSettingDto);
  }

}
