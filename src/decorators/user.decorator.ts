import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { AuthRequest } from 'src/middleware/auth.middleware';

export const User = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request: AuthRequest = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
