import { Transform } from 'class-transformer';
import { IsIn, IsOptional, IsString } from 'class-validator';
import { PaginationDto } from '../../../common/dtos/pagination.dto.js';

export class SearchResourceCategoriesByDto extends PaginationDto {
  @IsOptional()
  @IsString()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  term?: string;

  @IsOptional()
  @IsIn(['true', 'false'])
  isActive?: string;
}
