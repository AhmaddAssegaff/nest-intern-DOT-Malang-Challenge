import { Injectable } from '@nestjs/common';
import { QueryResult } from 'pg';
import { DatabaseService } from '../database/database.service';
import { blogRespone } from './blog.interface';
import {
  CreateBlogDto,
  GetBlogWithPagination,
  UpdateBlogDto,
} from './dto/blog.dto';

const SQL = {
  CREATE_BLOG:
    'INSERT INTO "blog" (title, content, author_id) VALUES ($1, $2, $3) RETURNING *',
  SELECT_BLOG_BY_ID:
    'SELECT * FROM "blog" WHERE id = $1 AND is_deleted = FALSE',
  SELECT_BLOG_PAGINATION:
    'SELECT * FROM "blog" WHERE is_deleted = FALSE ORDER BY created_at DESC LIMIT $1 OFFSET $2',
  UPDATE_BLOG_BY_ID:
    'UPDATE "blog" SET title = $1, content = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3 AND author_id = $4 RETURNING *',
  DELETE_BLOG_BY_ID:
    'UPDATE "blog" SET is_deleted = TRUE, updated_at = CURRENT_TIMESTAMP WHERE id = $1 AND author_id = $2 RETURNING *',
};

@Injectable()
export class BlogRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  async insertBlog(
    createBlogDto: CreateBlogDto,
    userId: string,
  ): Promise<blogRespone> {
    const { title, content } = createBlogDto;

    const result: QueryResult<blogRespone> = await this.databaseService.query(
      SQL.CREATE_BLOG,
      [title, content, userId],
    );

    return result.rows[0];
  }

  async selectManyBlogWithPagination(
    getBlogWithPagination: GetBlogWithPagination,
  ): Promise<blogRespone[]> {
    const { limit, page } = getBlogWithPagination;

    const defalutLimit = limit ?? 10;
    const defalutPage = page ?? 1;

    const offset = (defalutPage - 1) * defalutLimit;

    const result: QueryResult<blogRespone> = await this.databaseService.query(
      SQL.SELECT_BLOG_PAGINATION,
      [defalutLimit, offset],
    );

    return result.rows;
  }

  async selectOneBlogById(id: string): Promise<blogRespone> {
    const result: QueryResult<blogRespone> = await this.databaseService.query(
      SQL.SELECT_BLOG_BY_ID,
      [id],
    );

    return result.rows[0];
  }

  async setBlogById(
    updateBlogDto: UpdateBlogDto,
    userId: string,
    blogId: string,
  ): Promise<blogRespone> {
    const { title, content } = updateBlogDto;

    const result: QueryResult<blogRespone> = await this.databaseService.query(
      SQL.UPDATE_BLOG_BY_ID,
      [title, content, blogId, userId],
    );

    return result.rows[0];
  }

  async deleteOneBlogById(
    blogId: string,
    userId: string,
  ): Promise<blogRespone> {
    const result: QueryResult<blogRespone> = await this.databaseService.query(
      SQL.DELETE_BLOG_BY_ID,
      [blogId, userId],
    );

    return result.rows[0];
  }
}
