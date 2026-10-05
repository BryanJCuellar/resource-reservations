import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto.js';

export class EditUserDto extends PartialType(CreateUserDto) {}
