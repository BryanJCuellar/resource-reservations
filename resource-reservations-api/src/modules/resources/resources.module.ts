import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Resource } from './entities/resource.entity.js';
import { ResourcesController } from './controllers/resources.controller.js';
import { ResourcesService } from './services/resources.service.js';
import { AuthModule } from '../auth/auth.module.js';
import { ResourceCategory } from '../resource-categories/entities/resource-category.entity.js';

@Module({
  imports: [TypeOrmModule.forFeature([Resource, ResourceCategory]), AuthModule],
  controllers: [ResourcesController],
  providers: [ResourcesService],
})
export class ResourcesModule {}
