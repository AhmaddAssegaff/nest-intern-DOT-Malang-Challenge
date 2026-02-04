import { Injectable } from '@nestjs/common';
import { BlogRepository } from './blog.repository';
import {
  CreateBlogDto,
  GetBlogWithPagination,
  UpdateBlogDto,
} from './dto/blog.dto';
import { blogRespone } from './blog.interface';

@Injectable()
export class BlogService {
  constructor(private readonly blogRepository: BlogRepository) {}

  createBlog(
    createBlogDto: CreateBlogDto,
    userId: string,
  ): Promise<blogRespone> {
    return this.blogRepository.insertBlog(createBlogDto, userId);
  }

  findBlogWithPagination(
    getBlogWithPagination: GetBlogWithPagination,
  ): Promise<blogRespone[]> {
    return this.blogRepository.selectManyBlogWithPagination(
      getBlogWithPagination,
    );
  }

  findOneBlogById(blogId: string): Promise<blogRespone> {
    return this.blogRepository.selectOneBlogById(blogId);
  }

  updateOneBlogById(
    updateBlogDto: UpdateBlogDto,
    userId: string,
    blogId: string,
  ): Promise<blogRespone> {
    return this.blogRepository.setBlogById(updateBlogDto, userId, blogId);
  }

  removeOneBlogById(blogId: string, userId: string): Promise<blogRespone> {
    return this.blogRepository.deleteOneBlogById(blogId, userId);
  }
}
