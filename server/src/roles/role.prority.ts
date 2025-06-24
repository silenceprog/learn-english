import { Role } from "generated/prisma";

export const RolePriority: Record<Role, number> = {
    [Role.USER]: 1,
    [Role.ADMIN]: 2,
    [Role.OWNER]: 3,
  };