import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginRequestDto {
  @ApiProperty({
    description: 'Username pengguna',
    example: 'Ahmad',
  })
  @IsString()
  username: string;

  @ApiProperty({
    description: 'Password pengguna',
    example: 'password',
  })
  @IsString()
  password: string;
}

export class ReqisterRequestDto extends LoginRequestDto {}
