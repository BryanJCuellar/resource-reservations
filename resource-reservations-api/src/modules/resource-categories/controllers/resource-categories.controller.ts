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
import { ResourceCategoriesService } from '../services/resource-categories.service.js';
import {
  CreateResourceCategoryDto,
  EditResourceCategoryDto,
  SearchResourceCategoriesByDto,
} from '../dtos/index.js';
import { Auth } from '../../auth/decorators/auth.decorator.js';
import { UserRoles } from '../../roles/enums/index.js';

@Auth()
@Controller('resource-categories')
export class ResourceCategoriesController {
  constructor(
    private readonly resourceCategoriesService: ResourceCategoriesService,
  ) {}

  @Auth(UserRoles.ADMIN)
  @Post()
  create(@Body() dto: CreateResourceCategoryDto) {
    return this.resourceCategoriesService.create(dto);
  }

  @Get()
  findAll(@Query() dto: SearchResourceCategoriesByDto) {
    return this.resourceCategoriesService.findAll(dto);
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.resourceCategoriesService.findOne(id);
  }

  @Auth(UserRoles.ADMIN)
  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: EditResourceCategoryDto,
  ) {
    return this.resourceCategoriesService.update(id, dto);
  }

  @Auth(UserRoles.ADMIN)
  @Delete(':id')
  deactivate(@Param('id', ParseUUIDPipe) id: string) {
    return this.resourceCategoriesService.deactivate(id);
  }

  @Auth(UserRoles.ADMIN)
  @Patch(':id/reactivate')
  reactivate(@Param('id', ParseUUIDPipe) id: string) {
    return this.resourceCategoriesService.reactivate(id);
  }
}
