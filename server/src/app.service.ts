import { Injectable } from '@nestjs/common';
import { UsersService } from './users/users.service';

@Injectable()
export class AppService {
  constructor(private usersService: UsersService) {}
  async getHello(userId: number): Promise<string> {
    const user = await this.usersService.findById(userId);
    return `Hello ${user!.username}!`;
  }

  async getConsole(text: any,result?:any) {
  console.log('🔍 RESULT DEBUG:', {
      input: text,
      raw_result: result,
      result_type: typeof result,
      result_keys: Object.keys(result || {}),
      text_field: result?.text,
      translation_field: result?.text
    });
  }
}
