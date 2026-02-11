import { Test, TestingModule } from '@nestjs/testing';
import { BlogService } from '../blog.service';
import { BlogRepository } from '../blog.repository';
import {
  CreateBlogDto,
  GetBlogWithPaginationDto,
  UpdateBlogDto,
} from '../dto/blog.dto';

describe('BlogService', () => {
  let service: BlogService;

  const blogRepositoryMock = {
    insertBlog: jest.fn().mockResolvedValue({}),
    selectManyBlogWithPagination: jest.fn().mockResolvedValue([]),
    selectManyBlogWithPaginationUser: jest.fn().mockResolvedValue([]),
    selectOneBlogById: jest.fn().mockResolvedValue({}),
    setBlogById: jest.fn().mockResolvedValue({}),
    deleteOneBlogById: jest.fn().mockResolvedValue({}),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BlogService,
        {
          provide: BlogRepository,
          useValue: blogRepositoryMock,
        },
      ],
    }).compile();

    service = module.get<BlogService>(BlogService);

    jest.clearAllMocks();
  });

  describe('createBlog', () => {
    it('should only call insertBlog', async () => {
      const dto: CreateBlogDto = { content: 'content', title: 'title' };
      const userId = '95d7a924-5681-41b7-a853-f32f8922e366';

      await service.createBlog(dto, userId);

      expect(blogRepositoryMock.insertBlog).toHaveBeenCalledWith(dto, userId);
      expect(blogRepositoryMock.insertBlog).toHaveBeenCalledTimes(1);

      expect(
        blogRepositoryMock.selectManyBlogWithPagination,
      ).not.toHaveBeenCalled();
      expect(blogRepositoryMock.selectOneBlogById).not.toHaveBeenCalled();
      expect(blogRepositoryMock.setBlogById).not.toHaveBeenCalled();
      expect(blogRepositoryMock.deleteOneBlogById).not.toHaveBeenCalled();
    });
  });

  describe('findBlogWithPagination', () => {
    it('should only call selectManyBlogWithPagination', async () => {
      const dto: GetBlogWithPaginationDto = { page: 1, limit: 5 };

      await service.findBlogWithPagination(dto);

      expect(
        blogRepositoryMock.selectManyBlogWithPagination,
      ).toHaveBeenCalledWith(dto);
      expect(
        blogRepositoryMock.selectManyBlogWithPagination,
      ).toHaveBeenCalledTimes(1);

      expect(blogRepositoryMock.insertBlog).not.toHaveBeenCalled();
      expect(
        blogRepositoryMock.selectManyBlogWithPaginationUser,
      ).not.toHaveBeenCalled();
      expect(blogRepositoryMock.selectOneBlogById).not.toHaveBeenCalled();
      expect(blogRepositoryMock.setBlogById).not.toHaveBeenCalled();
      expect(blogRepositoryMock.deleteOneBlogById).not.toHaveBeenCalled();
    });
  });

  describe('findBlogWithPaginationUser', () => {
    it('should only call selectManyBlogWithPaginationUser', async () => {
      const userId = '919c4daf-0267-4b15-9e08-2babc241bedf';
      const dto: GetBlogWithPaginationDto = { page: 1, limit: 5 };

      await service.findBlogWithPaginationUser(dto, userId);

      expect(
        blogRepositoryMock.selectManyBlogWithPaginationUser,
      ).toHaveBeenCalledWith(dto, userId);
      expect(
        blogRepositoryMock.selectManyBlogWithPaginationUser,
      ).toHaveBeenCalledTimes(1);

      expect(blogRepositoryMock.insertBlog).not.toHaveBeenCalled();
      expect(
        blogRepositoryMock.selectManyBlogWithPagination,
      ).not.toHaveBeenCalled();
      expect(blogRepositoryMock.selectOneBlogById).not.toHaveBeenCalled();
      expect(blogRepositoryMock.setBlogById).not.toHaveBeenCalled();
      expect(blogRepositoryMock.deleteOneBlogById).not.toHaveBeenCalled();
    });
  });

  describe('findOneBlogById', () => {
    it('should only call selectOneBlogById', async () => {
      const blogId = 'blog-uuid';

      await service.findOneBlogById(blogId);

      expect(blogRepositoryMock.selectOneBlogById).toHaveBeenCalledWith(blogId);
      expect(blogRepositoryMock.selectOneBlogById).toHaveBeenCalledTimes(1);

      expect(blogRepositoryMock.insertBlog).not.toHaveBeenCalled();
      expect(
        blogRepositoryMock.selectManyBlogWithPaginationUser,
      ).not.toHaveBeenCalled();
      expect(
        blogRepositoryMock.selectManyBlogWithPagination,
      ).not.toHaveBeenCalled();
      expect(blogRepositoryMock.setBlogById).not.toHaveBeenCalled();
      expect(blogRepositoryMock.deleteOneBlogById).not.toHaveBeenCalled();
    });
  });

  describe('updateOneBlogById', () => {
    it('should only call setBlogById', async () => {
      const dto: UpdateBlogDto = { title: 'title', content: 'content' };
      const blogId = 'blog-uuid';
      const userId = 'user-uuid';

      await service.updateOneBlogById(dto, userId, blogId);

      expect(blogRepositoryMock.setBlogById).toHaveBeenCalledWith(
        dto,
        userId,
        blogId,
      );
      expect(blogRepositoryMock.setBlogById).toHaveBeenCalledTimes(1);

      expect(blogRepositoryMock.insertBlog).not.toHaveBeenCalled();
      expect(
        blogRepositoryMock.selectManyBlogWithPagination,
      ).not.toHaveBeenCalled();
      expect(
        blogRepositoryMock.selectManyBlogWithPaginationUser,
      ).not.toHaveBeenCalled();
      expect(blogRepositoryMock.selectOneBlogById).not.toHaveBeenCalled();
      expect(blogRepositoryMock.deleteOneBlogById).not.toHaveBeenCalled();
    });
  });

  describe('removeOneBlogById', () => {
    it('should only call deleteOneBlogById', async () => {
      const userId = 'ec6f538f-7eb6-4aa5-b24b-09372f567267';

      await service.removeOneBlogById(userId);

      expect(blogRepositoryMock.deleteOneBlogById).toHaveBeenCalledWith(userId);
      expect(blogRepositoryMock.deleteOneBlogById).toHaveBeenCalledTimes(1);

      expect(blogRepositoryMock.insertBlog).not.toHaveBeenCalled();
      expect(
        blogRepositoryMock.selectManyBlogWithPagination,
      ).not.toHaveBeenCalled();
      expect(
        blogRepositoryMock.selectManyBlogWithPaginationUser,
      ).not.toHaveBeenCalled();
      expect(blogRepositoryMock.selectOneBlogById).not.toHaveBeenCalled();
      expect(blogRepositoryMock.setBlogById).not.toHaveBeenCalled();
    });
  });
});
