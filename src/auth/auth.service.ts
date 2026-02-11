import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { LoginRequestDto, ReqisterRequestDto } from './dto/auth.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { CONSTANTS } from 'src/config';
import { AuthResponseDto, JwtAuthPayload } from './jwt.interface';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  private readonly accessSecret: string;
  private readonly accessExpiresIn: number;
  private readonly refreshSecret: string;
  private readonly refreshExpiresIn: number;

  constructor(
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
    private readonly userService: UserService,
  ) {
    this.accessSecret = this.config.getOrThrow(
      CONSTANTS.JWT.AUTH_JWT_ACCESS_TOKEN_SECRET,
    );
    this.accessExpiresIn = this.config.getOrThrow(
      CONSTANTS.JWT.AUTH_JWT_ACCESS_TOKEN_EXPIRES_IN,
    );
    this.refreshSecret = this.config.getOrThrow(
      CONSTANTS.JWT.AUTH_JWT_REFRESH_TOKEN_SECRET,
    );
    this.refreshExpiresIn = this.config.getOrThrow(
      CONSTANTS.JWT.AUTH_JWT_REFRESH_TOKEN_EXPIRES_IN,
    );
  }

  private signAccessToken(payload: JwtAuthPayload): string {
    return this.jwtService.sign(payload, {
      algorithm: 'HS256',
      secret: this.accessSecret,
      expiresIn: this.accessExpiresIn,
    });
  }

  private signRefreshToken(payload: JwtAuthPayload): string {
    return this.jwtService.sign(payload, {
      algorithm: 'HS256',
      secret: this.refreshSecret,
      expiresIn: this.refreshExpiresIn,
    });
  }

  async login(dto: LoginRequestDto): Promise<AuthResponseDto> {
    const user = await this.userService.findUserByUsername(dto.username);
    if (!user) {
      throw new UnauthorizedException('Username atau password salah');
    }

    const isValid = await bcrypt.compare(dto.password, user.password);
    if (!isValid) {
      throw new UnauthorizedException('Username atau password salah');
    }

    const payload: JwtAuthPayload = {
      sub: user.id,
      role: user.role,
    };

    return {
      tokens: {
        accessToken: this.signAccessToken(payload),
        refreshToken: this.signRefreshToken(payload),
      },
    };
  }

  async register(dto: ReqisterRequestDto): Promise<AuthResponseDto> {
    const exists = await this.userService.findUserByUsername(dto.username);
    if (exists) {
      throw new ConflictException('Username sudah dipakai');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const user = await this.userService.createUser({
      username: dto.username,
      password: hashedPassword,
    });

    const payload: JwtAuthPayload = {
      sub: user.id,
      role: user.role,
    };

    return {
      tokens: {
        accessToken: this.signAccessToken(payload),
        refreshToken: this.signRefreshToken(payload),
      },
    };
  }

  async refreshToken(payload: JwtAuthPayload): Promise<AuthResponseDto> {
    const user = await this.userService.findUserById(payload.sub);
    if (!user) {
      throw new UnauthorizedException();
    }

    const newPayload: JwtAuthPayload = {
      sub: user.id,
      role: user.role,
    };

    return {
      tokens: {
        accessToken: this.signAccessToken(newPayload),
        refreshToken: this.signRefreshToken(newPayload),
      },
    };
  }
}
