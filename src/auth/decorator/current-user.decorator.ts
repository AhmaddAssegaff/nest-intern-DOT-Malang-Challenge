import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { userRole } from 'src/user/user.interface';

interface RequestWithUser extends Request {
  user: {
    role: userRole;
  };
}

export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<RequestWithUser>();
    return request.user;
  },
);
