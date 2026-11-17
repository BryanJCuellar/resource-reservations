import { PartialType } from '@nestjs/mapped-types';
import { CreateRoleDto } from './create-role.dto.js';

export class EditRoleDto extends PartialType(CreateRoleDto, {
  skipNullProperties: false,
}) {}
