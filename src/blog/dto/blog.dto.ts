import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';

export class CreateBlogDto {
  @ApiProperty({
    description: 'Judul blog',
    example: 'Belajar NestJS',
  })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({
    description: 'Konten blog',
    example: 'Ini adalah konten blog pertama saya',
  })
  @IsNotEmpty()
  @IsString()
  content: string;
}

export class UpdateBlogDto extends PartialType(CreateBlogDto) {
  @ApiPropertyOptional({
    description: 'Judul blog yang diupdate',
    example: 'Belajar NestJS - Update',
  })
  title?: string;

  @ApiPropertyOptional({
    description: 'Konten blog yang diupdate',
    example: 'Konten blog yang sudah diperbarui',
  })
  content?: string;
}

export class GetBlogWithPagination {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 10;
}
