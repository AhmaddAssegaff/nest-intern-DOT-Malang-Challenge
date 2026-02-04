import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from '../user.controller';
import { UserService } from '../user.service';
import { JwtPayload } from 'src/auth/jwt.interface';
import { userRole } from '../user.interface';

describe('UserController', () => {
  let controller: UserController;

  const userServiceMock = {
    createUser: jest.fn().mockResolvedValue({}),
    findUserById: jest.fn().mockResolvedValue({}),
    findUserByUsername: jest.fn().mockResolvedValue({}),
    findProfile: jest.fn().mockResolvedValue({}),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        UserService,
        {
          provide: UserService,
          useValue: userServiceMock,
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);

    jest.clearAllMocks();
  });

  describe('getProfile', () => {
    it('should be only call findProfile', async () => {
      const payload: JwtPayload = {
        sub: '854fd4ca-03f7-4191-abeb-3690339f9290',
        username: 'username',
        role: userRole.user,
        exp: 123,
        iat: 123,
      };

      await controller.getProfile(payload);

      expect(userServiceMock.findProfile).toHaveBeenCalledTimes(1);
      expect(userServiceMock.findProfile).toHaveBeenCalledWith(payload.sub);

      expect(userServiceMock.createUser).not.toHaveBeenCalled();
      expect(userServiceMock.findUserById).not.toHaveBeenCalled();
      expect(userServiceMock.findUserByUsername).not.toHaveBeenCalled();
    });
  });
});
