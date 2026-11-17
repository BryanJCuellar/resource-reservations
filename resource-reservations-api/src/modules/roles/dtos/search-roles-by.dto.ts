import { IsIn, IsOptional, IsString } from 'class-validator';
import { PaginationDto } from '../../../common/dtos/pagination.dto.js';
import { Transform } from 'class-transformer';

export class SearchRolesByDto extends PaginationDto {
  @IsOptional()
  @IsString()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  term?: string;

  @IsOptional()
  @IsIn(['true', 'false'])
  isActive?: string;
}
