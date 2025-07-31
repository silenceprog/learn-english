import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';


@Injectable()
export class AdminService {
  constructor(private readonly databaseService: DatabaseService) {}

  async softDelete(id: number) {
    return this.databaseService.user.update({
      where: { id },
      data: {
        deleteAt: new Date(),
      },
    });
  }

  async hardDelete(id: number) {
    return this.databaseService.user.delete({
      where: {
        id,
      },
    });
  }

   async restore(id: number) {
    return this.databaseService.user.update({
      where: { id },
      data: {
        deleteAt: null,
      },
    });
  }

  async findDeleted() {
    return this.databaseService.user.findMany({
      where: {
        deleteAt: {
          not: null,
        },
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
