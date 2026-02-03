import { Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { CreateUserDto } from './dto/createUser.dto';
import { InterfaceUsers } from './user.interface';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  createUser(createUserDto: CreateUserDto): Promise<InterfaceUsers> {
    return this.userRepository.insertUser(createUserDto);
  }

  findUserById(id: string): Promise<InterfaceUsers> {
    return this.userRepository.selectOneUserById(id);
  }

  findUserByUsername(username: string): Promise<InterfaceUsers> {
    return this.userRepository.selectOneUserByUsername(username);
  }
}
