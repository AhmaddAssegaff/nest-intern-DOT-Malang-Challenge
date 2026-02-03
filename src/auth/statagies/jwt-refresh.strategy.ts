import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { ConfigSchema } from 'src/config';
import { JwtConfigI } from 'src/config/jwt.config';
import { JwtPayload } from '../jwt.interface';
import { UserService } from '../../user/user.service';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(
    private readonly configService: ConfigService<ConfigSchema>,
    private readonly userService: UserService,
  ) {
    const jwtConfig = configService.getOrThrow<JwtConfigI>('jwt');

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: jwtConfig.AUTH_JWT_REFRESH_TOKEN_SECRET,
      algorithms: ['HS256'],
      ignoreExpiration: false,
    });
  }

  async validate(payload: JwtPayload) {
    const user = await this.userService.findUserById(payload.sub);

    if (!user) {
      throw new UnauthorizedException();
    }

    return payload;
  }
}
