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
import { type AuthenticatedUser } from 'src/auth/jwt.interface';

@ApiBearerAuth('access-token')
@Controller('blog')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @Roles(userRole.USER)
  @UseGuards(JwtAccessGuard, RolesGuard)
  @Post()
  postBlog(
    @CurrentUser() user: AuthenticatedUser,
    @Body() createBlogDto: CreateBlogDto,
  ) {
    return this.blogService.createBlog(createBlogDto, user.sub);
  }

  @Get()
  getManyBlogWithPagination(
    @Query() getBlogWithPagination: GetBlogWithPaginationDto,
  ) {
    return this.blogService.findBlogWithPagination(getBlogWithPagination);
  }

  @Roles(userRole.USER)
  @UseGuards(JwtAccessGuard, RolesGuard)
  @Get('me')
  getManyBlogWithPaginationUser(
    @CurrentUser() user: AuthenticatedUser,
    @Query() getBlogWithPaginationUser: GetBlogWithPaginationUserDto,
  ) {
    return this.blogService.findBlogWithPaginationUser(
      getBlogWithPaginationUser,
      user.sub,
    );
  }

  @Get(':id')
  getOneBlogById(@Param('id') id: string) {
    return this.blogService.findOneBlogById(id);
  }

  @Roles(userRole.USER)
  @UseGuards(JwtAccessGuard, RolesGuard)
  @Patch(':id')
  patchOneBlogById(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') blogId: string,
    @Body() updateBlogDto: UpdateBlogDto,
  ) {
    return this.blogService.updateOneBlogById(updateBlogDto, user.sub, blogId);
  }

  @Roles(userRole.ADMIN)
  @UseGuards(JwtAccessGuard, RolesGuard)
  @Delete(':id')
  deleteOneBlogById(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') blogId: string,
  ) {
    return this.blogService.removeOneBlogById(blogId, user.sub);
  }
}
