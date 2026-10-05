import { PartialType } from '@nestjs/mapped-types';
import { CreateReservationDto } from './create-reservation.dto.js';
import { ReservationStatus } from '../enums/index.js';
import { IsEnum, IsOptional } from 'class-validator';

export class EditReservationDto extends PartialType(CreateReservationDto) {
  @IsOptional()
  @IsEnum(ReservationStatus)
  status?: ReservationStatus;
}
