import { Injectable } from '@nestjs/common';
import { BlogRepository } from './blog.repository';
import {
  CreateBlogDto,
  GetBlogWithPaginationDto,
  GetBlogWithPaginationUserDto,
  UpdateBlogDto,
} from './dto/blog.dto';
import { BlogRespone } from './blog.interface';

@Injectable()
export class BlogService {
  constructor(private readonly blogRepository: BlogRepository) { }

  createBlog(
    createBlogDto: CreateBlogDto,
    userId: string,
  ): Promise<BlogRespone> {
    return this.blogRepository.insertBlog(createBlogDto, userId);
  }

  findBlogWithPagination(
    getBlogWithPagination: GetBlogWithPaginationDto,
  ): Promise<BlogRespone[]> {
    return this.blogRepository.selectManyBlogWithPagination(
      getBlogWithPagination,
    );
  }

  findBlogWithPaginationUser(
    getBlogWithPaginationUserDto: GetBlogWithPaginationUserDto,
    userId: string,
  ): Promise<BlogRespone[]> {
    return this.blogRepository.selectManyBlogWithPaginationUser(
      getBlogWithPaginationUserDto,
      userId,
    );
  }

  findOneBlogById(blogId: string): Promise<BlogRespone> {
    return this.blogRepository.selectOneBlogById(blogId);
  }

  updateOneBlogById(
    updateBlogDto: UpdateBlogDto,
    userId: string,
    blogId: string,
  ): Promise<BlogRespone> {
    return this.blogRepository.setBlogById(updateBlogDto, userId, blogId);
  }

  removeOneBlogById(blogId: string, userId: string): Promise<BlogRespone> {
    return this.blogRepository.deleteOneBlogById(blogId, userId);
  }
}
