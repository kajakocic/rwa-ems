import { IsDateString, IsInt, IsNotEmpty, IsNumber, IsString, IsUrl, Max, MaxLength, Min } from "class-validator";

export class CreateEventDto {

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @IsDateString()
  @IsNotEmpty()
  date: string;

  @IsInt()
  @Min(0)
  @Max(100000)
  capacity: number;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNumber()
  @Min(0)
  @Max(100000)
  ticketPrice: number;

  @IsUrl()
  @IsNotEmpty()
  urlImg: string;

  @IsInt()
  @IsNotEmpty()
  categoryId: number;

  @IsInt()
  @IsNotEmpty()
  locationId: number;
}