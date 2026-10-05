import { IsIn, IsOptional, IsString } from 'class-validator';
import { PaginationDto } from '../../../common/dtos/index.js';
import { Transform } from 'class-transformer';

export class SearchResourcesByDto extends PaginationDto {
  @IsOptional()
  @IsString()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  term?: string;

  @IsOptional()
  @IsIn(['true', 'false'])
  isActive?: string;
}
