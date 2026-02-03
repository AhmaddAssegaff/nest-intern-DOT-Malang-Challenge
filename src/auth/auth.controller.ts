import { Controller, Post, Body, HttpCode, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginRequestDto, ReqisterRequestDto } from './dto/auth.dto';
import { JwtRefreshGuard } from './guard/jwt-refresh.guard';
import { CurrentUser } from './decorator/current-user.decorator';
import { type JwtPayload } from './jwt.interface';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  @HttpCode(200)
  login(@Body() loginRequestDto: LoginRequestDto) {
    return this.authService.login(loginRequestDto);
  }

  @Post('/reqister')
  @HttpCode(200)
  reqister(@Body() reqisterRequestDto: ReqisterRequestDto) {
    return this.authService.reqister(reqisterRequestDto);
  }

  @ApiBearerAuth('refresh-token')
  @Post('/refresh')
  @UseGuards(JwtRefreshGuard)
  refreshToken(@CurrentUser() user: JwtPayload) {
    return this.authService.refreshToken(user);
  }
}
