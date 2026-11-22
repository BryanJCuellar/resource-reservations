import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto.js';

export class EditUserDto extends PartialType(
  OmitType(CreateUserDto, ['password']),
  {
    skipNullProperties: false,
  },
) {}
