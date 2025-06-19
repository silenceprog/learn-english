import { Injectable } from '@nestjs/common';
import { CreateSettingDto } from './dto/create-setting.dto';
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

  create(createSettingDto: CreateSettingDto) {
     return this.databaseService.setting.create({
            data: createSettingDto
        })
  }

  update(userId: number, updateSettingDto: UpdateSettingDto) {
     return this.databaseService.setting.update({
          where: {
            userId,
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
