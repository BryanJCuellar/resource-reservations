import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from '../entities/role.entity.js';
import { Repository } from 'typeorm';
import { CreateRoleDto } from '../dtos/create-role.dto.js';
import { HttpErrorsExceptions } from '../../../common/exceptions/http-errors.exceptions.js';
import { SearchRolesByDto } from '../dtos/search-roles-by.dto.js';
import { paginationValues } from '../../../common/consts/pagination-values.const.js';
import { EditRoleDto } from '../dtos/edit-role.dto.js';
import { UserRoles } from '../enums/index.js';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role) private readonly rolesRepo: Repository<Role>,
  ) {}

  async create(dto: CreateRoleDto): Promise<Role> {
    try {
      const role = this.rolesRepo.create(dto);
      return await this.rolesRepo.save(role);
    } catch (error) {
      HttpErrorsExceptions.handleHttpException(error, 'Error creating role');
    }
  }

  async findAll(dto: SearchRolesByDto): Promise<{
    data: Role[];
    count: number;
  }> {
    try {
      const {
        term,
        isActive,
        page = paginationValues.page,
        limit = paginationValues.limit,
      } = dto;

      const qb = this.rolesRepo.createQueryBuilder('role');

      if (term) {
        qb.andWhere('UPPER(role.name) LIKE UPPER(:term)', {
          term: `%${term}%`,
        });
      }

      if (isActive) {
        qb.andWhere('role.isActive = :isActive', {
          isActive: isActive === 'true',
        });
      }

      qb.orderBy('role.createdAt', 'DESC');

      const skip = (page - 1) * limit;
      qb.skip(skip);
      qb.take(limit);

      const [data, count] = await qb.getManyAndCount();

      return { data, count };
    } catch (error) {
      HttpErrorsExceptions.handleHttpException(error, 'Error fetching roles');
    }
  }

  async findOne(id: string) {
    try {
      const role = await this.rolesRepo.findOneBy({ id });

      if (!role) {
        throw new NotFoundException('Role not found');
      }

      return role;
    } catch (error) {
      HttpErrorsExceptions.handleHttpException(error, 'Error fetching role');
    }
  }

  async update(id: string, dto: EditRoleDto): Promise<Role> {
    try {
      if (Object.values(dto).every((value) => value === undefined)) {
        throw new BadRequestException('No fields provided to update');
      }

      const role = await this.rolesRepo.findOneBy({ id });

      if (!role) {
        throw new NotFoundException('Role not found');
      }

      if (!role.isActive) {
        throw new BadRequestException('Role is not active');
      }

      if (role.name === UserRoles.ADMIN) {
        throw new ForbiddenException(
          'The ADMIN role is protected and cannot be modified',
        );
      }

      if (dto.name !== undefined) {
        role.name = dto.name;
      }

      role.updatedAt = new Date();

      return await this.rolesRepo.save(role);
    } catch (error) {
      HttpErrorsExceptions.handleHttpException(error, 'Error updating role');
    }
  }

  async deactivate(id: string): Promise<Role> {
    try {
      const role = await this.rolesRepo.preload({ id });

      if (!role) {
        throw new NotFoundException('Role not found');
      }

      if (!role.isActive) {
        throw new BadRequestException('Role has already been deactivated');
      }

      if (role.name === UserRoles.ADMIN) {
        throw new ForbiddenException(
          'The ADMIN role is protected and cannot be modified',
        );
      }

      return await this.rolesRepo.save({
        ...role,
        isActive: false,
        updatedAt: new Date(),
        deletedAt: new Date(),
      });
    } catch (error) {
      HttpErrorsExceptions.handleHttpException(
        error,
        'Error deactivating role',
      );
    }
  }

  async reactivate(id: string): Promise<Role> {
    try {
      const role = await this.rolesRepo.preload({ id });

      if (!role) {
        throw new NotFoundException('Role not found');
      }

      if (role.isActive) {
        throw new BadRequestException('Role is already active');
      }

      if (role.name === UserRoles.ADMIN) {
        throw new ForbiddenException(
          'The ADMIN role is protected and cannot be modified',
        );
      }

      return await this.rolesRepo.save({
        ...role,
        isActive: true,
        updatedAt: new Date(),
        deletedAt: null,
      });
    } catch (error) {
      HttpErrorsExceptions.handleHttpException(
        error,
        'Error reactivating role',
      );
    }
  }
}
