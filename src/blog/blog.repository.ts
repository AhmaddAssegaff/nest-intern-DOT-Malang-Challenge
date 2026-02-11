import { Injectable, NotFoundException } from '@nestjs/common';
import { QueryResult } from 'pg';
import { DatabaseService } from '../database/database.service';
import { BlogRespone } from './blog.interface';
import {
  CreateBlogDto,
  GetBlogWithPaginationDto,
  GetBlogWithPaginationUserDto,
  UpdateBlogDto,
} from './dto/blog.dto';

const SQL = {
  CREATE_BLOG:
    'INSERT INTO "blog" (title, content, author_id) VALUES ($1, $2, $3) RETURNING *',
  SELECT_BLOG_BY_ID:
    'SELECT * FROM "blog" WHERE id = $1 AND is_deleted = FALSE',
  SELECT_BLOG_PAGINATION:
    'SELECT * FROM "blog" WHERE is_deleted = FALSE ORDER BY created_at DESC LIMIT $1 OFFSET $2',
  SELECT_BLOG_PAGINATION_USER:
    'SELECT * FROM "blog" WHERE is_deleted = FALSE AND author_id = $3 ORDER BY created_at DESC LIMIT $1 OFFSET $2',
  UPDATE_BLOG_BY_ID:
    'UPDATE "blog" SET title = $1, content = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3 AND author_id = $4 RETURNING *',
  DELETE_BLOG_BY_ID:
    'UPDATE "blog" SET is_deleted = TRUE, updated_at = CURRENT_TIMESTAMP WHERE id = $1 AND is_deleted = FALSE RETURNING *',
};

@Injectable()
export class BlogRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  async insertBlog(
    createBlogDto: CreateBlogDto,
    userId: string,
  ): Promise<BlogRespone> {
    const { title, content } = createBlogDto;

    const result: QueryResult<BlogRespone> = await this.databaseService.query(
      SQL.CREATE_BLOG,
      [title, content, userId],
    );

    return result.rows[0];
  }

  async selectManyBlogWithPagination(
    getBlogWithPagination: GetBlogWithPaginationDto,
  ): Promise<BlogRespone[]> {
    const { limit, page } = getBlogWithPagination;

    const defalutLimit = limit ?? 10;
    const defalutPage = page ?? 1;

    const offset = (defalutPage - 1) * defalutLimit;

    const result: QueryResult<BlogRespone> = await this.databaseService.query(
      SQL.SELECT_BLOG_PAGINATION,
      [defalutLimit, offset],
    );

    if (result.rows.length === 0) {
      throw new NotFoundException('blog tidak di temukan');
    }

    return result.rows;
  }

  async selectManyBlogWithPaginationUser(
    getBlogWithPaginationUser: GetBlogWithPaginationUserDto,
    userId: string,
  ): Promise<BlogRespone[]> {
    const { limit, page } = getBlogWithPaginationUser;

    const defalutLimit = limit ?? 10;
    const defalutPage = page ?? 1;

    const offset = (defalutPage - 1) * defalutLimit;

    const result: QueryResult<BlogRespone> = await this.databaseService.query(
      SQL.SELECT_BLOG_PAGINATION_USER,
      [defalutLimit, offset, userId],
    );

    if (result.rows.length === 0) {
      throw new NotFoundException('blog tidak di temukan');
    }

    return result.rows;
  }

  async selectOneBlogById(id: string): Promise<BlogRespone> {
    const result: QueryResult<BlogRespone> = await this.databaseService.query(
      SQL.SELECT_BLOG_BY_ID,
      [id],
    );

    if (result.rows.length === 0) {
      throw new NotFoundException('blog tidak di temukan');
    }

    return result.rows[0];
  }

  async setBlogById(
    updateBlogDto: UpdateBlogDto,
    userId: string,
    blogId: string,
  ): Promise<BlogRespone> {
    const { title, content } = updateBlogDto;

    const result: QueryResult<BlogRespone> = await this.databaseService.query(
      SQL.UPDATE_BLOG_BY_ID,
      [title, content, blogId, userId],
    );

    if (result.rows.length === 0) {
      throw new NotFoundException('blog tidak di temukan');
    }

    return result.rows[0];
  }

  async deleteOneBlogById(blogId: string): Promise<BlogRespone> {
    const result: QueryResult<BlogRespone> = await this.databaseService.query(
      SQL.DELETE_BLOG_BY_ID,
      [blogId],
    );

    if (result.rows.length === 0) {
      throw new NotFoundException('blog tidak di temukan');
    }

    return result.rows[0];
  }
}
