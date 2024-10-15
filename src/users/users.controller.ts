import {
  Controller,
  Get,
  Req,
  Param,
  ParseIntPipe,
  NotFoundException,
  Put,
  Body,
  ValidationPipe,
  BadRequestException,
  UseInterceptors,
  HttpCode,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { UpdatePhotoDto } from './dto/update-photo.dto';
import { AuthUser } from 'src/auth/decorators/user.decorator';
import { User } from 'src/entities/User';
import { UserResponseInterceptor } from './interceptors/user-response.interceptor';
import { Request } from 'express';
import { UserListInterceptor } from './interceptors/user-list.interceptor';
import { ConfigService } from '@nestjs/config';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private configService: ConfigService,
  ) {}

  @Get('me')
  @UseInterceptors(UserResponseInterceptor)
  getCurrentUser(@AuthUser() authUser: User): User {
    authUser.me = true;
    return authUser;
  }

  @Get('name/:name')
  @UseInterceptors(UserListInterceptor)
  async getUsersByName(
    @AuthUser() authUser: User,
    @Param('name') name: string,
  ): Promise<User[]> {
    const users = await this.usersService.getUsersByName(name);
    return users;
  }

  @Get(':id')
  @UseInterceptors(UserResponseInterceptor)
  async getUser(
    @AuthUser() authUser: User,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<User> {
    try {
      const user = await this.usersService.getUser(id);
      user.me = id === authUser.id;
      return user;
    } catch (e) {
      throw new NotFoundException();
    }
  }

  @Put('me')
  @HttpCode(204)
  async updateUserInfo(
    @AuthUser() authUser: User,
    @Body(new ValidationPipe({ transform: true, whitelist: true }))
    userDto: UpdateUserDto,
  ): Promise<void> {
    try {
      await this.usersService.updateUserInfo(authUser.id, userDto);
    } catch (e) {
      console.log(e);
      if (e.code === 'ER_DUP_ENTRY') {
        throw new BadRequestException('This email is already registered');
      } else {
        throw new NotFoundException();
      }
    }
  }

  @Put('me/password')
  @HttpCode(204)
  async updatePassword(
    @AuthUser() authUser: User,
    @Body(new ValidationPipe({ transform: true, whitelist: true }))
    passDto: UpdatePasswordDto,
  ): Promise<void> {
    try {
      await this.usersService.updatePassword(authUser.id, passDto);
    } catch (e) {
      throw new NotFoundException();
    }
  }

  @Put('me/photo')
  async updateAvatar(
    @AuthUser() authUser: User,
    @Body(new ValidationPipe({ transform: true, whitelist: true }))
    photoDto: UpdatePhotoDto,
    @Req() req: Request,
  ) {
    const baseUrl = `${this.configService.get<string>('protocol')}://${
      req.headers.host
    }/${this.configService.get<string>('basePath')}`;
    try {
      const avatar = await this.usersService.updatePhoto(authUser.id, photoDto);
      return { avatar: baseUrl + avatar };
    } catch (e) {
      throw new NotFoundException();
    }
  }
}
