import { Injectable } from '@nestjs/common';
import { UsersService } from './users/users.service';

@Injectable()
export class AppService {
  constructor(private usersService: UsersService) {}
  async getHello(userId: number): Promise<string> {
    const user = await this.usersService.findById(userId);
    return `Hello ${user!.username}!`;
  }
}
