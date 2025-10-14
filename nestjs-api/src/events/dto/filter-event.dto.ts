import { IsOptional, IsDateString, IsString } from 'class-validator';

export class FilterEventDto {
  @IsOptional()
  @IsDateString()
  date?: string;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsString()
  location?: string;
}