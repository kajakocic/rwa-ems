import { Type } from 'class-transformer';
import { IsOptional, IsDateString, IsString, IsNotEmpty, IsDate } from 'class-validator';

export class FilterEventDto {
  @Type(() => Date)  
  @IsDate()          
  @IsNotEmpty()
  @IsOptional()
  datum?: Date; 

  @IsOptional()
  @IsString()
  kategorija?: string;

  @IsOptional()
  @IsString()
  lokacija?: string;
}