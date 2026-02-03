import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '../user.service';
import { UserRepository } from '../user.repository';
import { CreateUserDto } from '../dto/createUser.dto';

describe('UserService', () => {
  let service: UserService;

  const UserRepositorMock = {
    insertUser: jest.fn().mockResolvedValue({}),
    selectOneUserById: jest.fn().mockResolvedValue({}),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: UserRepository,
          useValue: UserRepositorMock,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);

    jest.clearAllMocks();
  });

  describe('createUser', () => {
    it('should be only call insertUser', async () => {
      const dto: CreateUserDto = { username: 'username', password: 'password' };

      await service.createUser(dto);

      expect(UserRepositorMock.insertUser).toHaveBeenCalledTimes(1);
      expect(UserRepositorMock.insertUser).toHaveBeenCalledWith(dto);
      expect(UserRepositorMock.selectOneUserById).not.toHaveBeenCalled();
    });
  });

  describe('findUserById', () => {
    it('should be only call selectOneUserById', async () => {
      const dto: CreateUserDto = { username: 'username', password: 'password' };

      await service.createUser(dto);

      expect(UserRepositorMock.insertUser).toHaveBeenCalledTimes(1);
      expect(UserRepositorMock.insertUser).toHaveBeenCalledWith(dto);
      expect(UserRepositorMock.selectOneUserById).not.toHaveBeenCalled();
    });
  });
});
