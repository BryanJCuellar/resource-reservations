import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ResourceCategory } from '../entities/resource-category.entity.js';
import {
  CreateResourceCategoryDto,
  EditResourceCategoryDto,
  SearchResourceCategoriesByDto,
} from '../dtos/index.js';
import { HttpErrorsExceptions } from '../../../common/exceptions/http-errors.exceptions.js';
import { paginationValues } from '../../../common/consts/pagination-values.const.js';

@Injectable()
export class ResourceCategoriesService {
  constructor(
    @InjectRepository(ResourceCategory)
    private readonly resourceCategoriesRepo: Repository<ResourceCategory>,
  ) {}

  async create(dto: CreateResourceCategoryDto): Promise<ResourceCategory> {
    try {
      const resourceCategory = this.resourceCategoriesRepo.create(dto);
      return await this.resourceCategoriesRepo.save(resourceCategory);
    } catch (error) {
      HttpErrorsExceptions.handleHttpException(
        error,
        'Error creating resource category',
      );
    }
  }

  async findAll(dto: SearchResourceCategoriesByDto): Promise<{
    data: ResourceCategory[];
    count: number;
  }> {
    try {
      const {
        term,
        isActive,
        page = paginationValues.page,
        limit = paginationValues.limit,
      } = dto;

      const qb = this.resourceCategoriesRepo.createQueryBuilder('rc');

      if (term) {
        qb.andWhere(
          '(UPPER(rc.name) LIKE UPPER(:term) OR UPPER(rc.description) LIKE UPPER(:term))',
          { term: `%${term}%` },
        );
      }

      if (isActive) {
        qb.andWhere('rc.isActive = :isActive', {
          isActive: isActive === 'true',
        });
      }

      qb.orderBy('rc.createdAt', 'DESC');

      const skip = (page - 1) * limit;
      qb.skip(skip);
      qb.take(limit);

      const [data, count] = await qb.getManyAndCount();

      return { data, count };
    } catch (error) {
      HttpErrorsExceptions.handleHttpException(
        error,
        'Error fetching resource categories',
      );
    }
  }

  async findOne(id: string): Promise<ResourceCategory> {
    try {
      const resourceCategory = await this.resourceCategoriesRepo.findOneBy({
        id,
      });

      if (!resourceCategory) {
        throw new NotFoundException('Resource category not found');
      }

      return resourceCategory;
    } catch (error) {
      HttpErrorsExceptions.handleHttpException(
        error,
        'Error fetching resource category',
      );
    }
  }

  async update(
    id: string,
    dto: EditResourceCategoryDto,
  ): Promise<ResourceCategory> {
    try {
      if (Object.values(dto).every((value) => value === undefined)) {
        throw new BadRequestException('No fields provided to update');
      }

      const resourceCategory = await this.resourceCategoriesRepo.findOneBy({
        id,
      });

      if (!resourceCategory) {
        throw new NotFoundException('Resource category not found');
      }

      if (dto.name !== undefined) {
        resourceCategory.name = dto.name;
      }

      if (dto.description !== undefined) {
        resourceCategory.description = dto.description;
      }

      resourceCategory.updatedAt = new Date();

      return await this.resourceCategoriesRepo.save(resourceCategory);
    } catch (error) {
      HttpErrorsExceptions.handleHttpException(
        error,
        'Error updating resource category',
      );
    }
  }

  async deactivate(id: string): Promise<ResourceCategory> {
    try {
      const resourceCategory = await this.resourceCategoriesRepo.preload({
        id,
      });

      if (!resourceCategory) {
        throw new NotFoundException('Resource category not found');
      }

      if (!resourceCategory.isActive) {
        throw new BadRequestException(
          'Resource category has already been deactivated',
        );
      }

      return await this.resourceCategoriesRepo.save({
        ...resourceCategory,
        isActive: false,
        updatedAt: new Date(),
        deletedAt: new Date(),
      });
    } catch (error) {
      HttpErrorsExceptions.handleHttpException(
        error,
        'Error deactivating resource category',
      );
    }
  }

  async reactivate(id: string): Promise<ResourceCategory> {
    try {
      const resourceCategory = await this.resourceCategoriesRepo.preload({
        id,
      });

      if (!resourceCategory) {
        throw new NotFoundException('Resource category not found');
      }

      if (resourceCategory.isActive) {
        throw new BadRequestException('Resource category is already active');
      }

      return await this.resourceCategoriesRepo.save({
        ...resourceCategory,
        isActive: true,
        updatedAt: new Date(),
        deletedAt: null,
      });
    } catch (error) {
      HttpErrorsExceptions.handleHttpException(
        error,
        'Error reactivating resource category',
      );
    }
  }
}
