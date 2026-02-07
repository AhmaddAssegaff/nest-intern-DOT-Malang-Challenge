import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { CONSTANTS } from 'src/config';
import { AuthenticatedUser, JwtAuthPayload } from '../jwt.interface';
import { UserService } from '../../user/user.service';
import { JWT_REFRESH_TOKEN_STRATEGY } from '../constant';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  JWT_REFRESH_TOKEN_STRATEGY,
) {
  constructor(
    config: ConfigService,
    private readonly userService: UserService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.getOrThrow(
        CONSTANTS.JWT.AUTH_JWT_REFRESH_TOKEN_SECRET,
      ),
      algorithms: ['HS256'],
      ignoreExpiration: false,
    });
  }

  async validate(payload: JwtAuthPayload): Promise<AuthenticatedUser> {
    const user = await this.userService.findUserById(payload.sub);

    if (!user) {
      throw new UnauthorizedException();
    }

    return {
      sub: user.id,
      role: user.role,
    };
  }
}
