import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { RequestWithUser } from '../jwt.interface';

export const CurrentUser = createParamDecorator(
  <K extends keyof RequestWithUser['user'] = keyof RequestWithUser['user']>(
    data: K,
    ctx: ExecutionContext,
  ): RequestWithUser['user'][K] | RequestWithUser['user'] => {
    const request = ctx.switchToHttp().getRequest<RequestWithUser>();
    const user = request.user;
    return data ? user?.[data] : user;
  },
);
