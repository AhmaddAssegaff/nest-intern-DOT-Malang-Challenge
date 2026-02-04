import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '../auth.controller';
import { AuthService } from '../auth.service';
import { LoginRequestDto, ReqisterRequestDto } from '../dto/auth.dto';
import { JwtPayload } from '../jwt.interface';
import { userRole } from '../../user/user.interface';

describe('AuthController', () => {
  let controller: AuthController;

  const authServiceMock = {
    login: jest.fn().mockResolvedValue({}),
    reqister: jest.fn().mockResolvedValue({}),
    refreshToken: jest.fn().mockResolvedValue({}),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: authServiceMock,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);

    jest.clearAllMocks();
  });

  describe('login', () => {
    it('should be only call login', async () => {
      const dto: LoginRequestDto = {
        username: 'username',
        password: 'password',
      };

      await controller.login(dto);

      expect(authServiceMock.login).toHaveBeenCalledTimes(1);
      expect(authServiceMock.login).toHaveBeenCalledWith(dto);

      expect(authServiceMock.refreshToken).not.toHaveBeenCalled();
      expect(authServiceMock.reqister).not.toHaveBeenCalled();
    });
  });

  describe('reqister', () => {
    it('should be only call reqister', async () => {
      const dto: ReqisterRequestDto = {
        username: 'username',
        password: 'password',
      };

      await controller.reqister(dto);

      expect(authServiceMock.reqister).toHaveBeenCalledTimes(1);
      expect(authServiceMock.reqister).toHaveBeenCalledWith(dto);

      expect(authServiceMock.refreshToken).not.toHaveBeenCalled();
      expect(authServiceMock.login).not.toHaveBeenCalled();
    });
  });

  describe('refreshToken', () => {
    it('should be only call refreshToken', async () => {
      const user: JwtPayload = {
        sub: '8d176169-2b31-44a0-b10a-665071e59fe3',
        username: 'username',
        role: userRole.user,
        exp: 123,
        iat: 123,
      };
      await controller.refreshToken(user);

      expect(authServiceMock.refreshToken).toHaveBeenCalledTimes(1);
      expect(authServiceMock.refreshToken).toHaveBeenCalledWith(user);

      expect(authServiceMock.login).not.toHaveBeenCalled();
      expect(authServiceMock.reqister).not.toHaveBeenCalled();
    });
  });
});
