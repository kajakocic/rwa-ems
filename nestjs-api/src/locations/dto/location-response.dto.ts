import { IsInt, IsNotEmpty, IsString, MaxLength } from "class-validator";

export class LocationResponseDto {
    @IsInt()
    @IsNotEmpty()
    id:number;

    @IsString()
    @IsNotEmpty()
    @MaxLength(100)
    lokacija: string; 
}