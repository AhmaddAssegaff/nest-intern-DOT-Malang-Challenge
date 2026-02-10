import { Test, TestingModule } from '@nestjs/testing';
import { BlogController } from '../blog.controller';
import { BlogService } from '../blog.service';
import {
  CreateBlogDto,
  GetBlogWithPaginationDto,
  GetBlogWithPaginationUserDto,
  UpdateBlogDto,
} from '../dto/blog.dto';
import { AuthenticatedUser } from 'src/auth/jwt.interface';
import { userRole } from 'src/user/user.interface';

describe('BlogController', () => {
  let controller: BlogController;

  const blogServiceMock = {
    createBlog: jest.fn().mockResolvedValue({}),
    findBlogWithPagination: jest.fn().mockResolvedValue({}),
    findBlogWithPaginationUser: jest.fn().mockResolvedValue({}),
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
      const user: AuthenticatedUser = {
        sub: '7c966b34-7504-457a-a547-7bdd9f316e94',
        role: userRole.USER,
      };

      await controller.postBlog(user, dto);

      expect(blogServiceMock.createBlog).toHaveBeenCalled();
      expect(blogServiceMock.createBlog).toHaveBeenCalledTimes(1);
      expect(blogServiceMock.createBlog).toHaveBeenCalledWith(dto, user.sub);

      expect(blogServiceMock.findBlogWithPagination).not.toHaveBeenCalled();
      expect(blogServiceMock.findOneBlogById).not.toHaveBeenCalled();
      expect(blogServiceMock.updateOneBlogById).not.toHaveBeenCalled();
      expect(blogServiceMock.removeOneBlogById).not.toHaveBeenCalled();
    });
  });

  describe('getManyBlogWithPagination', () => {
    it('should be only call findBlogWithPagination', async () => {
      const dto: GetBlogWithPaginationDto = {
        page: 1,
        limit: 10,
      };

      await controller.getManyBlogWithPagination(dto);

      expect(blogServiceMock.findBlogWithPagination).toHaveBeenCalled();
      expect(blogServiceMock.findBlogWithPagination).toHaveBeenCalledTimes(1);
      expect(blogServiceMock.findBlogWithPagination).toHaveBeenCalledWith(dto);

      expect(blogServiceMock.createBlog).not.toHaveBeenCalled();
      expect(blogServiceMock.findBlogWithPaginationUser).not.toHaveBeenCalled();
      expect(blogServiceMock.findOneBlogById).not.toHaveBeenCalled();
      expect(blogServiceMock.updateOneBlogById).not.toHaveBeenCalled();
      expect(blogServiceMock.removeOneBlogById).not.toHaveBeenCalled();
    });
  });

  describe('getManyBlogWithPaginationUser', () => {
    it('should be only call findBlogWithPaginationUser  ', async () => {
      const dto: GetBlogWithPaginationUserDto = {
        page: 1,
        limit: 10,
      };
      const user: AuthenticatedUser = {
        sub: '90706e2d-1b5f-45eb-9703-7a908c159241',
        role: userRole.USER,
      };

      await controller.getManyBlogWithPaginationUser(user, dto);

      expect(blogServiceMock.findBlogWithPaginationUser).toHaveBeenCalled();
      expect(blogServiceMock.findBlogWithPaginationUser).toHaveBeenCalledTimes(
        1,
      );
      expect(blogServiceMock.findBlogWithPaginationUser).toHaveBeenCalledWith(
        dto,
        user.sub,
      );

      expect(blogServiceMock.createBlog).not.toHaveBeenCalled();
      expect(blogServiceMock.findBlogWithPagination).not.toHaveBeenCalled();
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
      expect(blogServiceMock.findBlogWithPaginationUser).not.toHaveBeenCalled();
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

      const user: AuthenticatedUser = {
        sub: 'c4d1e41b-a151-4ccf-bf94-bb1f7a5bf45c',
        role: userRole.USER,
      };
      const blogId = '7a804bd2-3104-4173-90dc-57697d9f1809';

      await controller.patchOneBlogById(user, blogId, dto);

      expect(blogServiceMock.updateOneBlogById).toHaveBeenCalled();
      expect(blogServiceMock.updateOneBlogById).toHaveBeenCalledTimes(1);
      expect(blogServiceMock.updateOneBlogById).toHaveBeenCalledWith(
        dto,
        user.sub,
        blogId,
      );

      expect(blogServiceMock.createBlog).not.toHaveBeenCalled();
      expect(blogServiceMock.findBlogWithPaginationUser).not.toHaveBeenCalled();
      expect(blogServiceMock.findBlogWithPagination).not.toHaveBeenCalled();
      expect(blogServiceMock.findOneBlogById).not.toHaveBeenCalled();
      expect(blogServiceMock.removeOneBlogById).not.toHaveBeenCalled();
    });
  });

  describe('deleteOneBlogById', () => {
    it('should be only call removeOneBlogById ', async () => {
      const blogId = '3c5be174-236a-455b-ae13-8f3696af51bd';
      const user: AuthenticatedUser = {
        sub: 'bcc01dec-4bf0-4b06-82ff-4ac085551b1b',
        role: userRole.ADMIN,
      };

      await controller.deleteOneBlogById(user, blogId);

      expect(blogServiceMock.removeOneBlogById).toHaveBeenCalled();
      expect(blogServiceMock.removeOneBlogById).toHaveBeenCalledTimes(1);
      expect(blogServiceMock.removeOneBlogById).toHaveBeenCalledWith(
        blogId,
        user.sub,
      );

      expect(blogServiceMock.createBlog).not.toHaveBeenCalled();
      expect(blogServiceMock.findBlogWithPaginationUser).not.toHaveBeenCalled();
      expect(blogServiceMock.findBlogWithPagination).not.toHaveBeenCalled();
      expect(blogServiceMock.findOneBlogById).not.toHaveBeenCalled();
      expect(blogServiceMock.updateOneBlogById).not.toHaveBeenCalled();
    });
  });
});
