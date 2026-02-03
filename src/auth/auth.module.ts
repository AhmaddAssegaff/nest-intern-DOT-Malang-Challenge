import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ConfigSchema } from 'src/config';
import { JwtAccessStrategy } from './statagies/jwt-access.strategy';
import { JwtConfigI } from 'src/config/jwt.config';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    ConfigModule,
    UserModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService<ConfigSchema>): JwtModuleOptions => {
        const jwtConfig = config.getOrThrow<JwtConfigI>('jwt');

        return {
          secret: jwtConfig.AUTH_JWT_ACCESS_TOKEN_SECRET,
          signOptions: {
            expiresIn: jwtConfig.AUTH_JWT_ACCESS_TOKEN_EXPIRES_IN,
          },
        };
      },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtAccessStrategy],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}
