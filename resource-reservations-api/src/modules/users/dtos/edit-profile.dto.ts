import { Transform } from 'class-transformer';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  Matches,
  ValidateIf,
} from 'class-validator';

export class EditProfileDto {
  @ValidateIf((_, value) => value !== undefined)
  @IsNotEmpty()
  @IsString()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @MaxLength(100)
  name?: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @MaxLength(20)
  @Matches(/^(?:|\+?(?=[0-9 ()-]*[0-9])[0-9 ()-]+)$/, {
    message: 'Phone must contain digits and may include spaces, hyphens, parentheses and a leading +',
  })
  phone?: string;
}
