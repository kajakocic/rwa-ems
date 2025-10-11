import { IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateLocationDto {
  @IsString()
  @IsOptional()
  @MaxLength(100)
  name?: string;
}