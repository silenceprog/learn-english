import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';


@Injectable()
export class AdminService {
  constructor(private readonly databaseService: DatabaseService) {}

  async deleteUser(id: number) {
    return this.databaseService.user.delete({
      where: {
        id,
      },
    });
  }

  async getStatisticsUsers() {}

  async getStatisticsTasks() {}

  async getStatisticsErrors() {}

  async setGlobalSettings() {}

  async setAdaptiveSettings() {}

  async setGameSettings() {}
}
