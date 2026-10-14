import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from '../entities/role.entity.js';
import { Repository } from 'typeorm';
import { CreateRoleDto } from '../dtos/create-role.dto.js';
import { HttpErrorsExceptions } from '../../../common/exceptions/http-errors.exceptions.js';

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
}
