import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ResourceCategory } from './entities/resource-category.entity.js';
import { ResourceCategoriesController } from './controllers/resource-categories.controller.js';
import { ResourceCategoriesService } from './services/resource-categories.service.js';
import { AuthModule } from '../auth/auth.module.js';

@Module({
  imports: [TypeOrmModule.forFeature([ResourceCategory]), AuthModule],
  controllers: [ResourceCategoriesController],
  providers: [ResourceCategoriesService],
})
export class ResourceCategoriesModule {}
