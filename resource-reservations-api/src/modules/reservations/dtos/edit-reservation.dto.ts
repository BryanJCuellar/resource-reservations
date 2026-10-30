import { PartialType } from '@nestjs/mapped-types';
import { CreateReservationDto } from './create-reservation.dto.js';
import { IsInt, IsNotEmpty, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class EditReservationDto extends PartialType(CreateReservationDto, {
  skipNullProperties: false,
}) {
  @IsNotEmpty()
  @IsInt()
  @Type(() => Number)
  @Min(1)
  version: number;
}
