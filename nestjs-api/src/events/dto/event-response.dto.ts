import { Type } from "class-transformer";
import { IsDate, IsDateString, IsInt, IsNotEmpty, IsNumber, IsString, IsUrl, Max, MaxLength, Min } from "class-validator";

export class EventResponseDto {

    @IsInt()
    @IsNotEmpty()
    id:number;

    @IsString()
    @IsNotEmpty()
    @MaxLength(100)
    naziv: string;

    @Type(() => Date)  
    @IsDate()          
    @IsNotEmpty()
    datum: Date; 
  
    @IsInt()
    @Min(0)
    @Max(100000)
    kapacitet: number;
  
    @IsString()
    @IsNotEmpty()
    opis: string;
  
    @IsNumber()
    @Min(0)
    @Max(100000)
    cenaKarte: number;
  
    @IsUrl()
    @IsNotEmpty()
    urLimg: string;

    @IsString()
    @IsNotEmpty()
    kategorija: string;

    @IsString()
    @IsNotEmpty()
    lokacija: string;

    @IsInt()
    @IsNotEmpty()
    kategorijaId: number;
  
    @IsInt()
    @IsNotEmpty()
    lokacijaId: number;
}

//IEvent