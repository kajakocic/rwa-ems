import { IsOptional, IsString, IsDateString, IsInt, IsNumber, IsUrl, Min, Max, MaxLength } from 'class-validator';

export class UpdateEventDto {
  @IsString()
  @IsOptional()
  @MaxLength(100)
  name?: string;

  @IsDateString()
  @IsOptional()
  date?: string;

  @IsInt()
  @Min(0)
  @Max(100000)
  @IsOptional()
  capacity?: number;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @Min(0)
  @Max(100000)
  @IsOptional()
  ticketPrice?: number;

  @IsUrl()
  @IsOptional()
  urlImg?: string;

  @IsInt()
  @IsOptional()
  categoryId?: number;

  @IsInt()
  @IsOptional()
  locationId?: number;
}