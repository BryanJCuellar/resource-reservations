import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { UsersService } from '../services/users.service.js';
import {
  CreateUserDto,
  EditProfileDto,
  EditUserDto,
  RegisterUserDto,
  SearchUsersByDto,
} from '../dtos/index.js';
import { Auth } from '../../auth/decorators/auth.decorator.js';
import { CurrentUser } from '../../auth/decorators/current-user.decorator.js';
import type { AuthenticatedUser } from '../../auth/interfaces/index.js';
import { UserRoles } from '../../roles/enums/index.js';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  register(@Body() dto: RegisterUserDto) {
    return this.usersService.register(dto);
  }

  @Auth()
  @Get('me')
  findMyProfile(@CurrentUser() authUser: AuthenticatedUser) {
    return this.usersService.findMyProfile(authUser);
  }

  @Auth()
  @Patch('me')
  updateMyProfile(
    @CurrentUser() authUser: AuthenticatedUser,
    @Body() dto: EditProfileDto,
  ) {
    return this.usersService.updateMyProfile(authUser, dto);
  }

  @Auth(UserRoles.ADMIN)
  @Post()
  create(@Body() dto: CreateUserDto) {
    return this.usersService.create(dto);
  }

  @Auth(UserRoles.ADMIN)
  @Get()
  findAll(@Query() dto: SearchUsersByDto) {
    return this.usersService.findAll(dto);
  }

  @Auth(UserRoles.ADMIN)
  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.findOne(id);
  }

  @Auth(UserRoles.ADMIN)
  @Patch(':id')
  update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: EditUserDto) {
    return this.usersService.update(id, dto);
  }

  @Auth(UserRoles.ADMIN)
  @Delete(':id')
  deactivate(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.deactivate(id);
  }

  @Auth(UserRoles.ADMIN)
  @Patch(':id/reactivate')
  reactivate(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.reactivate(id);
  }
}
