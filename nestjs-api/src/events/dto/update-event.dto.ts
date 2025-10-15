import { Type } from 'class-transformer';
import { IsOptional, IsString, IsDateString, IsInt, IsNumber, IsUrl, Min, Max, MaxLength, IsDate, IsNotEmpty } from 'class-validator';

export class UpdateEventDto {
  @IsString()
  @IsOptional()
  @MaxLength(100)
  naziv?: string;

  @Type(() => Date)  
  @IsDate()          
  @IsNotEmpty()
  @IsOptional()
  datum?: Date; 

  @IsInt()
  @Min(0)
  @Max(100000)
  @IsOptional()
  kapacitet?: number;

  @IsString()
  @IsOptional()
  opis?: string;

  @IsNumber()
  @Min(0)
  @Max(100000)
  @IsOptional()
  cenaKarte?: number;

  @IsUrl()
  @IsOptional()
  urLimg?: string;

  @IsInt()
  @IsOptional()
  kategorijaId?: number;

  @IsInt()
  @IsOptional()
  lokacijaId?: number;
}
//export class UpdateEventDto extends PartialType(CreateEventDto) {} moglo je i ovako da ne dupliram kod