import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '../user.service';
import { UserRepository } from '../user.repository';
import { CreateUserDto } from '../dto/createUser.dto';

describe('UserService', () => {
  let service: UserService;

  const UserRepositorMock = {
    insertUser: jest.fn().mockResolvedValue({}),
    selectOneUserById: jest.fn().mockResolvedValue({}),
    selectOneUserByUsername: jest.fn().mockResolvedValue({}),
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

      expect(UserRepositorMock.selectOneUserByUsername).not.toHaveBeenCalled();
      expect(UserRepositorMock.selectOneUserById).not.toHaveBeenCalled();
    });
  });

  describe('findUserById', () => {
    it('should be only call selectOneUserById', async () => {
      const id = 'cb8fe55f-f4c4-44b7-9980-8457e27900f9';

      await service.findUserById(id);

      expect(UserRepositorMock.selectOneUserById).toHaveBeenCalledTimes(1);
      expect(UserRepositorMock.selectOneUserById).toHaveBeenCalledWith(id);
      expect(UserRepositorMock.insertUser).not.toHaveBeenCalled();
      expect(UserRepositorMock.selectOneUserByUsername).not.toHaveBeenCalled();
    });
  });

  describe('findUserByUsername', () => {
    it('should be only call selectOneUserByUsername', async () => {
      const usermae = 'username';

      await service.findUserByUsername(usermae);

      expect(UserRepositorMock.selectOneUserByUsername).toHaveBeenCalledTimes(
        1,
      );
      expect(UserRepositorMock.selectOneUserByUsername).toHaveBeenCalledWith(
        usermae,
      );
      expect(UserRepositorMock.selectOneUserById).not.toHaveBeenCalled();
      expect(UserRepositorMock.insertUser).not.toHaveBeenCalled();
    });
  });
});
