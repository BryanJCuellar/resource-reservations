import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { UserRoles } from '../../roles/enums/index.js';
import { ROLES_KEY } from './roles.decorator.js';
import { JwtAuthGuard } from '../guards/jwt-auth.guard.js';
import { RolesGuard } from '../guards/roles.guard.js';

export const Auth = (...roles: UserRoles[]) => {
  return applyDecorators(
    ...(roles.length > 0 ? [SetMetadata(ROLES_KEY, roles)] : []),
    UseGuards(JwtAuthGuard, RolesGuard),
  );
};
