import { Injectable, NotFoundException } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { CreateUserDto } from './dto/createUser.dto';
import { UserResponese, UserProfileResponese } from './user.interface';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) { }

  createUser(createUserDto: CreateUserDto): Promise<UserResponese> {
    return this.userRepository.insertUser(createUserDto);
  }

  findUserById(id: string): Promise<UserResponese> {
    return this.userRepository.selectOneUserById(id);
  }

  findUserByUsername(username: string): Promise<UserResponese> {
    return this.userRepository.selectOneUserByUsername(username);
  }

  async findProfile(id: string): Promise<UserProfileResponese> {
    const user = await this.userRepository.selectOneUserById(id);

    if (!user) {
      throw new NotFoundException('user tidak di temukan');
    }

    const { password: _password, ...safeUser } = user;

    return safeUser;
  }
}
