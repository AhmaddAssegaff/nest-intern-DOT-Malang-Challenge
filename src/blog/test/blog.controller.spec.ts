import { Test, TestingModule } from '@nestjs/testing';
import { BlogController } from '../blog.controller';
import { BlogService } from '../blog.service';
import {
  CreateBlogDto,
  GetBlogWithPagination,
  UpdateBlogDto,
} from '../dto/blog.dto';

describe('BlogController', () => {
  let controller: BlogController;

  const blogServiceMock = {
    createBlog: jest.fn().mockResolvedValue({}),
    findBlogWithPagination: jest.fn().mockResolvedValue({}),
    findOneBlogById: jest.fn().mockResolvedValue({}),
    updateOneBlogById: jest.fn().mockResolvedValue({}),
    removeOneBlogById: jest.fn().mockResolvedValue({}),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BlogController],
      providers: [
        BlogService,
        {
          provide: BlogService,
          useValue: blogServiceMock,
        },
      ],
    }).compile();

    controller = module.get<BlogController>(BlogController);

    jest.clearAllMocks();
  });

  describe('postBlog', () => {
    it('should only call createBlog', async () => {
      const dto: CreateBlogDto = { content: 'content', title: 'title' };
      const userId = '95d7a924-5681-41b7-a853-f32f8922e366';

      await controller.postBlog(userId, dto);

      expect(blogServiceMock.createBlog).toHaveBeenCalled();
      expect(blogServiceMock.createBlog).toHaveBeenCalledTimes(1);
      expect(blogServiceMock.createBlog).toHaveBeenCalledWith(dto, userId);

      expect(blogServiceMock.findBlogWithPagination).not.toHaveBeenCalled();
      expect(blogServiceMock.findOneBlogById).not.toHaveBeenCalled();
      expect(blogServiceMock.updateOneBlogById).not.toHaveBeenCalled();
      expect(blogServiceMock.removeOneBlogById).not.toHaveBeenCalled();
    });
  });

  describe('findBlogWithPagination', () => {
    it('should be only call getManyBlogWithPagination', async () => {
      const dto: GetBlogWithPagination = {
        page: 1,
        limit: 10,
      };

      await controller.getManyBlogWithPagination(dto);

      expect(blogServiceMock.findBlogWithPagination).toHaveBeenCalled();
      expect(blogServiceMock.findBlogWithPagination).toHaveBeenCalledTimes(1);
      expect(blogServiceMock.findBlogWithPagination).toHaveBeenCalledWith(dto);

      expect(blogServiceMock.createBlog).not.toHaveBeenCalled();
      expect(blogServiceMock.findOneBlogById).not.toHaveBeenCalled();
      expect(blogServiceMock.updateOneBlogById).not.toHaveBeenCalled();
      expect(blogServiceMock.removeOneBlogById).not.toHaveBeenCalled();
    });
  });

  describe('getOneBlogById', () => {
    it('should be only call findOneBlogById ', async () => {
      const blogId = '95ead1c3-e35f-40cf-9957-e5a64e9f54ab';

      await controller.getOneBlogById(blogId);

      expect(blogServiceMock.findOneBlogById).toHaveBeenCalled();
      expect(blogServiceMock.findOneBlogById).toHaveBeenCalledTimes(1);
      expect(blogServiceMock.findOneBlogById).toHaveBeenCalledWith(blogId);

      expect(blogServiceMock.createBlog).not.toHaveBeenCalled();
      expect(blogServiceMock.findBlogWithPagination).not.toHaveBeenCalled();
      expect(blogServiceMock.updateOneBlogById).not.toHaveBeenCalled();
      expect(blogServiceMock.removeOneBlogById).not.toHaveBeenCalled();
    });
  });

  describe('patchOneBlogById', () => {
    it('should be only call getOneBlogById ', async () => {
      const dto: UpdateBlogDto = {
        content: 'content',
        title: 'title',
      };

      const userId = 'c709af5b-0b7d-4393-ade8-0e8963c9cd70';
      const blogId = '7a804bd2-3104-4173-90dc-57697d9f1809';

      await controller.patchOneBlogById(userId, blogId, dto);

      expect(blogServiceMock.updateOneBlogById).toHaveBeenCalled();
      expect(blogServiceMock.updateOneBlogById).toHaveBeenCalledTimes(1);
      expect(blogServiceMock.updateOneBlogById).toHaveBeenCalledWith(
        dto,
        userId,
        blogId,
      );

      expect(blogServiceMock.createBlog).not.toHaveBeenCalled();
      expect(blogServiceMock.findBlogWithPagination).not.toHaveBeenCalled();
      expect(blogServiceMock.findOneBlogById).not.toHaveBeenCalled();
      expect(blogServiceMock.removeOneBlogById).not.toHaveBeenCalled();
    });
  });

  describe('deleteOneBlogById', () => {
    it('should be only call removeOneBlogById ', async () => {
      const userId = '3c5be174-236a-455b-ae13-8f3696af51bd';
      const blogId = '64bad37f-4ef0-4088-890d-ef66b8ba042a';

      await controller.deleteOneBlogById(userId, blogId);

      expect(blogServiceMock.removeOneBlogById).toHaveBeenCalled();
      expect(blogServiceMock.removeOneBlogById).toHaveBeenCalledTimes(1);
      expect(blogServiceMock.removeOneBlogById).toHaveBeenCalledWith(
        blogId,
        userId,
      );

      expect(blogServiceMock.createBlog).not.toHaveBeenCalled();
      expect(blogServiceMock.findBlogWithPagination).not.toHaveBeenCalled();
      expect(blogServiceMock.findOneBlogById).not.toHaveBeenCalled();
      expect(blogServiceMock.updateOneBlogById).not.toHaveBeenCalled();
    });
  });
});
