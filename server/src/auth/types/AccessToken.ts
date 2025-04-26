import { LoginUserDto } from "../dto/login-user.dto";

export type AccessToken = {
    access_token: string;
    user: LoginUserDto
  };