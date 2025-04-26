import { Role } from "generated/prisma";
import { SafeUser } from "src/users/dto/safe-user";

export type AccessToken = {
    access_token: string;
    user_role:Role;
  };