import { PartialType } from '@nestjs/mapped-types';
import { CreateResourceDto } from './create-resource.dto.js';

export class EditResourceDto extends PartialType(CreateResourceDto) {}
