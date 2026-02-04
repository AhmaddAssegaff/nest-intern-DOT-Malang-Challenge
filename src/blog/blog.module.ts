import { Module } from '@nestjs/common';
import { BlogService } from './blog.service';
import { BlogController } from './blog.controller';
import { BlogRepository } from './blog.repository';
import { DatabaseService } from '../database/database.service';

@Module({
  controllers: [BlogController],
  providers: [BlogService, BlogRepository, DatabaseService],
})
export class BlogModule {}
