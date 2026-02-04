import { Injectable, NotFoundException } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { CreateUserDto } from './dto/createUser.dto';
import { userResponese, userProfileResponese } from './user.interface';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  createUser(createUserDto: CreateUserDto): Promise<userResponese> {
    return this.userRepository.insertUser(createUserDto);
  }

  findUserById(id: string): Promise<userResponese> {
    return this.userRepository.selectOneUserById(id);
  }

  findUserByUsername(username: string): Promise<userResponese> {
    return this.userRepository.selectOneUserByUsername(username);
  }

  async findProfile(id: string): Promise<userProfileResponese> {
    const user = await this.userRepository.selectOneUserById(id);

    if (!user) {
      throw new NotFoundException('user tidak di temukan');
    }

    const { password: _password, ...safeUser } = user;

    return safeUser;
  }
}
