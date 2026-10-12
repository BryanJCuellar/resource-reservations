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
import { ResourcesService } from '../services/resources.service.js';
import {
  CreateResourceDto,
  EditResourceDto,
  SearchResourcesByDto,
} from '../dtos/index.js';
import { Auth } from '../../auth/decorators/auth.decorator.js';
import { UserRoles } from '../../roles/enums/index.js';

@Auth()
@Controller('resources')
export class ResourcesController {
  constructor(private readonly resourcesService: ResourcesService) {}

  @Auth(UserRoles.ADMIN, UserRoles.STAFF)
  @Post()
  create(@Body() dto: CreateResourceDto) {
    return this.resourcesService.create(dto);
  }

  @Get()
  findAll(@Query() dto: SearchResourcesByDto) {
    return this.resourcesService.findAll(dto);
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.resourcesService.findOne(id);
  }

  @Auth(UserRoles.ADMIN, UserRoles.STAFF)
  @Patch(':id')
  update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: EditResourceDto) {
    return this.resourcesService.update(id, dto);
  }

  @Auth(UserRoles.ADMIN, UserRoles.STAFF)
  @Delete(':id')
  deactivate(@Param('id', ParseUUIDPipe) id: string) {
    return this.resourcesService.deactivate(id);
  }

  @Auth(UserRoles.ADMIN, UserRoles.STAFF)
  @Patch(':id/reactivate')
  reactivate(@Param('id', ParseUUIDPipe) id: string) {
    return this.resourcesService.reactivate(id);
  }
}
