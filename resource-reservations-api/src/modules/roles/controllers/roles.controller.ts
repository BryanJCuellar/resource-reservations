import { Controller, Post } from '@nestjs/common';
import { RolesService } from '../services/roles.service.js';
import { CreateRoleDto } from '../dtos/create-role.dto.js';
import { Auth } from '../../auth/decorators/auth.decorator.js';
import { UserRoles } from '../enums/index.js';

@Auth()
@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Auth(UserRoles.ADMIN)
  @Post()
  create(dto: CreateRoleDto) {
    return this.rolesService.create(dto);
  }
}
