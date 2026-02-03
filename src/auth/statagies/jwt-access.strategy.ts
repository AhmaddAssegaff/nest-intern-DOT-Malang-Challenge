import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { ConfigSchema } from 'src/config';
import { JwtConfigI } from 'src/config/jwt.config';

@Injectable()
export class JwtAccessStrategy extends PassportStrategy(
  Strategy,
  'jwt-access',
) {
  constructor(private readonly configService: ConfigService<ConfigSchema>) {
    const jwtConfig = configService.getOrThrow<JwtConfigI>('jwt');

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: jwtConfig.AUTH_JWT_ACCESS_TOKEN_SECRET,
      algorithms: ['HS256'],
      ignoreExpiration: false,
    });
  }

  async validate(payload: unknown) {
    return payload;
  }
}
