import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Resource } from '../entities/resource.entity.js';
import { Repository } from 'typeorm';
import {
  CreateResourceDto,
  EditResourceDto,
  SearchResourcesByDto,
} from '../dtos/index.js';
import { HttpErrorsExceptions } from '../../../common/exceptions/index.js';
import { paginationValues } from '../../../common/consts/index.js';
import { ResourceCategory } from '../../resource-categories/entities/resource-category.entity.js';

@Injectable()
export class ResourcesService {
  constructor(
    @InjectRepository(Resource)
    private readonly resourcesRepository: Repository<Resource>,
    @InjectRepository(ResourceCategory)
    private readonly resourceCategoriesRepo: Repository<ResourceCategory>,
  ) {}

  async create(dto: CreateResourceDto): Promise<Resource> {
    try {
      const { name, code, description, resourceCategoryId } = dto;

      const resourceCategory =
        await this.getActiveResourceCategory(resourceCategoryId);

      const resource = this.resourcesRepository.create({
        name,
        code,
        description,
        resourceCategory,
      });

      return await this.resourcesRepository.save(resource);
    } catch (error) {
      HttpErrorsExceptions.handleHttpException(
        error,
        'Error creating resource',
      );
    }
  }

  async findAll(dto: SearchResourcesByDto): Promise<{
    data: Resource[];
    count: number;
  }> {
    try {
      const {
        term,
        isActive,
        page = paginationValues.page,
        limit = paginationValues.limit,
      } = dto;

      const qb = this.resourcesRepository
        .createQueryBuilder('resource')
        .leftJoinAndSelect('resource.resourceCategory', 'resourceCategory');

      if (term) {
        qb.andWhere(
          '(UPPER(resource.name) LIKE UPPER(:term) OR UPPER(resource.code) LIKE UPPER(:term))',
          { term: `%${term}%` },
        );
      }

      if (isActive) {
        qb.andWhere('resource.isActive = :isActive', {
          isActive: isActive === 'true',
        });
      }

      qb.orderBy('resource.createdAt', 'DESC');

      const skip = (page - 1) * limit;
      qb.skip(skip);
      qb.take(limit);

      const [data, count] = await qb.getManyAndCount();

      return { data, count };
    } catch (error) {
      HttpErrorsExceptions.handleHttpException(
        error,
        'Error fetching resources',
      );
    }
  }

  async findOne(id: string): Promise<Resource> {
    try {
      const resource = await this.resourcesRepository.findOne({
        where: { id },
        relations: { resourceCategory: true },
      });

      if (!resource) {
        throw new NotFoundException('Resource not found');
      }

      return resource;
    } catch (error) {
      HttpErrorsExceptions.handleHttpException(
        error,
        'Error fetching resource',
      );
    }
  }

  async update(id: string, dto: EditResourceDto): Promise<Resource> {
    try {
      if (Object.values(dto).every((value) => value === undefined)) {
        throw new BadRequestException('No fields provided to update');
      }

      const resource = await this.resourcesRepository.findOneBy({ id });

      if (!resource) {
        throw new NotFoundException('Resource not found');
      }

      if (!resource.isActive) {
        throw new BadRequestException('Resource is not active');
      }

      if (dto.name !== undefined) {
        resource.name = dto.name;
      }

      if (dto.code !== undefined) {
        resource.code = dto.code;
      }

      if (dto.description !== undefined) {
        resource.description = dto.description;
      }

      if (dto.resourceCategoryId !== undefined) {
        resource.resourceCategory = await this.getActiveResourceCategory(
          dto.resourceCategoryId,
        );
      }

      resource.updatedAt = new Date();

      return await this.resourcesRepository.save(resource);
    } catch (error) {
      HttpErrorsExceptions.handleHttpException(
        error,
        'Error updating resource',
      );
    }
  }

  async deactivate(id: string): Promise<Resource> {
    try {
      const resource = await this.resourcesRepository.preload({ id });

      if (!resource) {
        throw new NotFoundException('Resource not found');
      }

      if (!resource.isActive) {
        throw new BadRequestException('Resource has already been deactivated');
      }

      return await this.resourcesRepository.save({
        ...resource,
        isActive: false,
        updatedAt: new Date(),
        deletedAt: new Date(),
      });
    } catch (error) {
      HttpErrorsExceptions.handleHttpException(
        error,
        'Error deactivating resource',
      );
    }
  }

  async reactivate(id: string): Promise<Resource> {
    try {
      const resource = await this.resourcesRepository.preload({ id });

      if (!resource) {
        throw new NotFoundException('Resource not found');
      }

      if (resource.isActive) {
        throw new BadRequestException('Resource is already active');
      }

      return await this.resourcesRepository.save({
        ...resource,
        isActive: true,
        updatedAt: new Date(),
        deletedAt: null,
      });
    } catch (error) {
      HttpErrorsExceptions.handleHttpException(
        error,
        'Error reactivating resource',
      );
    }
  }

  private async getActiveResourceCategory(
    id: string,
  ): Promise<ResourceCategory> {
    const resourceCategory = await this.resourceCategoriesRepo.findOneBy({
      id,
    });

    if (!resourceCategory) {
      throw new NotFoundException('Resource category not found');
    }

    if (!resourceCategory.isActive) {
      throw new BadRequestException('Resource requires an active category');
    }

    return resourceCategory;
  }
}
