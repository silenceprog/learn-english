import { Injectable } from '@nestjs/common';
import { UpdateSettingDto } from './dto/update-setting.dto';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class SettingsService {
  constructor(private readonly databaseService: DatabaseService) { }

   async findById(userId: number) {
    return await this.databaseService.setting.findUnique({
      where: { userId },
    });
  }

  update(userId: number, updateSettingDto: UpdateSettingDto) {
     return this.databaseService.setting.update({
          where: {
            userId,
          },
          data: updateSettingDto,
        })
  }
}
