import { Injectable } from '@nestjs/common';
import { QueryResult } from 'pg';
import { DatabaseService } from '../database/database.service';
import { CreateUserDto } from './dto/createUser.dto';
import { userResponese } from './user.interface';

const SQL = {
  CREATE_USER:
    'INSERT INTO users (username, password) VALUES ($1, $2) RETURNING id, username, role, created_at',
  SELECT_USER_BY_ID: 'SELECT * FROM users WHERE id = $1',
  SELECT_USER_BY_USERNAME: 'SELECT * FROM users WHERE username = $1',
};

@Injectable()
export class UserRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  async insertUser(createUserDto: CreateUserDto): Promise<userResponese> {
    const { password, username } = createUserDto;

    const result: QueryResult<userResponese> = await this.databaseService.query(
      SQL.CREATE_USER,
      [username, password],
    );

    return result.rows[0];
  }

  async selectOneUserById(id: string): Promise<userResponese> {
    const result: QueryResult<userResponese> = await this.databaseService.query(
      SQL.SELECT_USER_BY_ID,
      [id],
    );

    return result.rows[0];
  }

  async selectOneUserByUsername(username: string): Promise<userResponese> {
    const result: QueryResult<userResponese> = await this.databaseService.query(
      SQL.SELECT_USER_BY_USERNAME,
      [username],
    );

    return result.rows[0];
  }
}
