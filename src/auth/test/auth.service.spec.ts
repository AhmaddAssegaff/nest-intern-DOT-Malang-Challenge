import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../auth.service';
import { LoginRequestDto, ReqisterRequestDto } from '../dto/auth.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UserService } from '../../user/user.service';
import { JwtAuthPayload } from '../jwt.interface';
import { UserResponese, userRole } from '../../user/user.interface';

jest.mock('bcrypt', () => ({
  compare: jest.fn(),
  hash: jest.fn(),
}));

describe('AuthService ', () => {
  let service: AuthService;

  const jwtServiceMock = {
    sign: jest.fn(),
  };

  const jwtConfigMock = {
    AUTH_JWT_ACCESS_TOKEN_SECRET: 'secret',
    AUTH_JWT_ACCESS_TOKEN_EXPIRES_IN: 123,
    AUTH_JWT_REFRESH_TOKEN_SECRET: 'secret',
    AUTH_JWT_REFRESH_TOKEN_EXPIRES_IN: 123,
  };

  const configServiceMock = {
    getOrThrow: jest.fn().mockReturnValue(jwtConfigMock),
  };

  const mockUserResponse: UserResponese = {
    id: '5612124b-7df9-47e5-8928-2fca779df0a0',
    username: 'username',
    password: 'hashedpassword',
    role: userRole.USER,
    created_at: new Date('2026-02-04T00:00:00Z'),
  };

  const userServiceMock = {
    findUserByUsername: jest.fn().mockResolvedValue(mockUserResponse),
    findUserById: jest.fn().mockResolvedValue(mockUserResponse),
    createUser: jest.fn().mockResolvedValue(mockUserResponse),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: JwtService, useValue: jwtServiceMock },
        { provide: ConfigService, useValue: configServiceMock },
        { provide: UserService, useValue: userServiceMock },
      ],
    }).compile();

    configServiceMock.getOrThrow.mockReturnValue(jwtConfigMock);
    service = module.get<AuthService>(AuthService);

    jest.clearAllMocks();
  });

  describe('login', () => {
    it('should only call findUserByUsername and return tokens', async () => {
      const dto: LoginRequestDto = {
        username: 'user',
        password: 'password',
      };

      userServiceMock.findUserByUsername.mockResolvedValue(mockUserResponse);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      jwtServiceMock.sign.mockReturnValue('token');

      const result = await service.login(dto);

      expect(userServiceMock.findUserByUsername).toHaveBeenCalledTimes(1);
      expect(userServiceMock.findUserByUsername).toHaveBeenCalledWith(
        dto.username,
      );

      expect(bcrypt.compare).toHaveBeenCalledTimes(1);
      expect(bcrypt.compare).toHaveBeenCalledWith(
        dto.password,
        mockUserResponse.password,
      );

      expect(jwtServiceMock.sign).toHaveBeenCalledTimes(2);

      expect(result.tokens.accessToken).toBe('token');
      expect(result.tokens.refreshToken).toBe('token');

      expect(userServiceMock.findUserById).not.toHaveBeenCalled();
      expect(userServiceMock.createUser).not.toHaveBeenCalled();
    });
  });

  describe('register', () => {
    it('should only call createUser and return tokens', async () => {
      const dto: ReqisterRequestDto = {
        username: 'user',
        password: 'password',
      };

      const hashedPassword = 'hashedpassword';

      userServiceMock.findUserByUsername.mockResolvedValue(null);
      userServiceMock.createUser.mockResolvedValue(mockUserResponse);
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashedpassword');

      jwtServiceMock.sign.mockReturnValue('token');

      const result = await service.register(dto);

      expect(userServiceMock.createUser).toHaveBeenCalledTimes(1);
      expect(userServiceMock.findUserByUsername).toHaveBeenCalledWith(
        dto.username,
      );
      expect(userServiceMock.createUser).toHaveBeenCalledWith({
        username: dto.username,
        password: hashedPassword,
      });

      expect(jwtServiceMock.sign).toHaveBeenCalledTimes(2);

      expect(result.tokens.accessToken).toBe('token');
      expect(result.tokens.refreshToken).toBe('token');

      expect(userServiceMock.findUserById).not.toHaveBeenCalled();
    });
  });

  describe('refreshToken', () => {
    it('should only call findUserById and return tokens', async () => {
      const dto: JwtAuthPayload = {
        sub: 'd6db433b-7105-4a85-aa83-1bfb0b54df6e',
        role: userRole.USER,
        exp: 123,
        iat: 123,
      };

      userServiceMock.findUserById.mockResolvedValue(mockUserResponse);

      jwtServiceMock.sign.mockReturnValue('token');

      const result = await service.refreshToken(dto);

      expect(userServiceMock.findUserById).toHaveBeenCalledTimes(1);
      expect(userServiceMock.findUserById).toHaveBeenCalledWith(dto.sub);

      expect(userServiceMock.createUser).not.toHaveBeenCalled();
      expect(userServiceMock.findUserByUsername).not.toHaveBeenCalled();

      expect(jwtServiceMock.sign).toHaveBeenCalledTimes(2);

      expect(result.tokens.accessToken).toBe('token');
      expect(result.tokens.refreshToken).toBe('token');
    });
  });
});
