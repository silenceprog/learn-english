import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { AccessToken } from 'src/auth/types/AccessToken';
import { AccessTokenPayload } from 'src/auth/types/AccessTokenPayload';


export const GetCurrentUserId = createParamDecorator(
  (_: undefined, context: ExecutionContext): number => {
    const request = context.switchToHttp().getRequest();
    const user = request.user as AccessTokenPayload;
    return user.id;
  },
);