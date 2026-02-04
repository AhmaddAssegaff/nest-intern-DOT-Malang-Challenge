import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { BlogService } from './blog.service';
import { Roles } from '../auth/decorator/roles.decorator';
import { JwtAccessGuard } from 'src/auth/guard/jwt-access.guard';
import { RolesGuard } from '../auth/guard/user-roles.guard';
import { userRole } from '../user/user.interface';
import { ApiBearerAuth } from '@nestjs/swagger';
import { CurrentUser } from '../auth/decorator/current-user.decorator';
import {
  CreateBlogDto,
  GetBlogWithPaginationDto,
  GetBlogWithPaginationUserDto,
  UpdateBlogDto,
} from './dto/blog.dto';

@ApiBearerAuth('access-token')
@Controller('blog')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @Roles(userRole.user)
  @UseGuards(JwtAccessGuard, RolesGuard)
  @Post()
  postBlog(
    @CurrentUser('sub') userId: string,
    @Body() createBlogDto: CreateBlogDto,
  ) {
    return this.blogService.createBlog(createBlogDto, userId);
  }

  @Get()
  getManyBlogWithPagination(
    @Query() getBlogWithPagination: GetBlogWithPaginationDto,
  ) {
    return this.blogService.findBlogWithPagination(getBlogWithPagination);
  }

  @Roles(userRole.user)
  @UseGuards(JwtAccessGuard, RolesGuard)
  @Get('me')
  getManyBlogWithPaginationUser(
    @CurrentUser('sub') userId: string,
    @Query() getBlogWithPaginationUser: GetBlogWithPaginationUserDto,
  ) {
    return this.blogService.findBlogWithPaginationUser(
      getBlogWithPaginationUser,
      userId,
    );
  }

  @Get(':id')
  getOneBlogById(@Param('id') id: string) {
    return this.blogService.findOneBlogById(id);
  }

  @Roles(userRole.user)
  @UseGuards(JwtAccessGuard, RolesGuard)
  @Patch(':id')
  patchOneBlogById(
    @CurrentUser('sub') userId: string,
    @Param('id') blogId: string,
    @Body() updateBlogDto: UpdateBlogDto,
  ) {
    return this.blogService.updateOneBlogById(updateBlogDto, userId, blogId);
  }

  @Roles(userRole.admin)
  @UseGuards(JwtAccessGuard, RolesGuard)
  @Delete(':id')
  deleteOneBlogById(
    @CurrentUser('sub') userId: string,
    @Param('id') blogId: string,
  ) {
    return this.blogService.removeOneBlogById(blogId, userId);
  }
}
