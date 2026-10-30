import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  ValidateIf,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { ReservationStatus } from '../enums/index.js';

export class CreateReservationDto {
  @IsOptional()
  @IsString()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @MaxLength(500)
  description?: string;

  @IsNotEmpty()
  @IsDateString({ strict: true })
  startAt: string;

  @IsNotEmpty()
  @IsDateString({ strict: true })
  endAt: string;

  @ValidateIf((_, value) => value !== undefined)
  @IsEnum(ReservationStatus)
  status?: ReservationStatus;

  @IsNotEmpty()
  @IsUUID()
  userId: string;

  @IsNotEmpty()
  @IsUUID()
  resourceId: string;
}
