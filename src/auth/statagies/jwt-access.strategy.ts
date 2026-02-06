import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { CONSTANTS } from 'src/config';
import { JwtPayload } from '../jwt.interface';
import { UserService } from 'src/user/user.service';
import { JWT_ACCESS_TOKEN_STRATEGY } from '../constant';

@Injectable()
export class JwtAccessStrategy extends PassportStrategy(
  Strategy,
  JWT_ACCESS_TOKEN_STRATEGY,
) {
  constructor(
    private readonly config: ConfigService,
    private readonly userService: UserService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.getOrThrow(
        CONSTANTS.JWT.AUTH_JWT_ACCESS_TOKEN_SECRET,
      ),
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
