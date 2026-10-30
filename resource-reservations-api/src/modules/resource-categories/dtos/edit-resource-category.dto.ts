import { PartialType } from '@nestjs/mapped-types';
import { CreateResourceCategoryDto } from './create-resource-category.dto.js';

export class EditResourceCategoryDto extends PartialType(
  CreateResourceCategoryDto,
  { skipNullProperties: false },
) {}
