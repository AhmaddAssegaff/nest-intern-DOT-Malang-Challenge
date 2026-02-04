import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { JwtAccessStrategy } from './statagies/jwt-access.strategy';
import { JwtRefreshStrategy } from './statagies/jwt-refresh.strategy';
import { UserModule } from '../user/user.module';

@Module({
  imports: [ConfigModule, UserModule, JwtModule],
  controllers: [AuthController],
  providers: [AuthService, JwtAccessStrategy, JwtRefreshStrategy],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}
