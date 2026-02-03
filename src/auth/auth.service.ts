import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { LoginRequestDto, ReqisterRequestDto } from './dto/auth.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { ConfigSchema } from 'src/config';
import { JwtConfigI } from 'src/config/jwt.config';
import { JwtPayload } from './jwt.interface';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import { userRole } from 'src/user/user.interface';

@Injectable()
export class AuthService {
  private readonly accessSecret: string;
  private readonly accessExpiresIn: number;
  private readonly refreshSecret: string;
  private readonly refreshExpiresIn: number;

  constructor(
    private readonly jwtService: JwtService,
    private readonly config: ConfigService<ConfigSchema>,
    private readonly userService: UserService,
  ) {
    const jwtConfig = this.config.getOrThrow<JwtConfigI>('jwt');

    this.accessSecret = jwtConfig.AUTH_JWT_ACCESS_TOKEN_SECRET;
    this.accessExpiresIn = jwtConfig.AUTH_JWT_ACCESS_TOKEN_EXPIRES_IN;
    this.refreshSecret = jwtConfig.AUTH_JWT_REFRESH_TOKEN_SECRET;
    this.refreshExpiresIn = jwtConfig.AUTH_JWT_REFRESH_TOKEN_EXPIRES_IN;
  }

  signAccessToken(payload: JwtPayload) {
    return this.jwtService.sign(payload, {
      secret: this.accessSecret,
      expiresIn: this.accessExpiresIn,
    });
  }

  signRefreshToken(payload: JwtPayload) {
    return this.jwtService.sign(payload, {
      secret: this.refreshSecret,
      expiresIn: this.refreshExpiresIn,
    });
  }

  verifyAccessToken(token: string): JwtPayload | null {
    try {
      return this.jwtService.verify<JwtPayload>(token, {
        secret: this.accessSecret,
      });
    } catch {
      return null;
    }
  }

  verifyRefreshToken(token: string): JwtPayload | null {
    try {
      return this.jwtService.verify<JwtPayload>(token, {
        secret: this.refreshSecret,
      });
    } catch {
      return null;
    }
  }

  async login(loginRequestDto: LoginRequestDto) {
    const { username, password } = loginRequestDto;

    const user = await this.userService.findUserByUsername(username);
    if (!user) {
      throw new UnauthorizedException('Username atau password salah');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Username atau password salah');
    }

    const payload: JwtPayload = {
      sub: user.id,
      username: user.username,
      role: userRole.user,
    };

    const accessToken = this.signAccessToken(payload);
    const refreshToken = this.signRefreshToken(payload);

    return {
      payload: payload,
      tokens: {
        accessToken,
        refreshToken,
      },
    };
  }

  async reqister(reqisterRequestDto: ReqisterRequestDto) {
    const { username, password } = reqisterRequestDto;

    const existingUser = await this.userService.findUserByUsername(username);
    if (existingUser) {
      throw new ConflictException('Username sudah di pakai');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await this.userService.createUser({
      username,
      password: hashedPassword,
    });

    const payload: JwtPayload = {
      sub: newUser.id,
      username: newUser.username,
      role: userRole.user,
    };

    const accessToken = this.signAccessToken(payload);
    const refreshToken = this.signRefreshToken(payload);

    return {
      payload: payload,
      tokens: {
        accessToken,
        refreshToken,
      },
    };
  }

  async refreshToken(payload: JwtPayload) {
    const user = await this.userService.findUserById(payload.sub);
    if (!user) {
      throw new UnauthorizedException();
    }

    const newPayload: JwtPayload = {
      sub: user.id,
      username: user.username,
      role: user.role,
    };

    const accessToken = this.signAccessToken(newPayload);
    const refreshToken = this.signRefreshToken(newPayload);

    return {
      payload: newPayload,
      tokens: {
        accessToken,
        refreshToken,
      },
    };
  }
}
