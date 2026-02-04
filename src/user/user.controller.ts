import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { CurrentUser } from '../auth/decorator/current-user.decorator';
import { JwtAccessGuard } from '../auth/guard/jwt-access.guard';
import { type JwtPayload } from '../auth/jwt.interface';
import { UserService } from './user.service';

@ApiBearerAuth('access-token')
@UseGuards(JwtAccessGuard)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('me')
  getProfile(@CurrentUser() token: JwtPayload) {
    return this.userService.findProfile(token.sub);
  }
}
