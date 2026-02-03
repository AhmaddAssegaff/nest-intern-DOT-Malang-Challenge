import { Controller, Post, Body, HttpCode, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginRequestDto, ReqisterRequestDto } from './dto/auth.dto';
import { RolesGuard } from './guard/user-roles.guard';

@UseGuards(RolesGuard)
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
}
