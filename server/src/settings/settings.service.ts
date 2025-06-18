import { Injectable } from '@nestjs/common';
import { CreateSettingDto } from './dto/create-setting.dto';
import { UpdateSettingDto } from './dto/update-setting.dto';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class SettingsService {
  constructor(private readonly databaseService: DatabaseService) { }
  create(createSettingDto: CreateSettingDto) {
     return this.databaseService.setting.create({
            data: createSettingDto
        })
  }

  update(id: number, updateSettingDto: UpdateSettingDto) {
     return this.databaseService.setting.update({
          where: {
            id,
          },
          data: updateSettingDto,
        })
  }

  remove(id: number) {
    return this.databaseService.setting.delete({
            where:{
                id,
            }
        })
  }
}
