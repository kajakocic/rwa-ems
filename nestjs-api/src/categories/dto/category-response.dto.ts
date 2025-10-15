import { IsInt, IsNotEmpty, IsString, MaxLength } from "class-validator";

export class CategoryResponseDto {
    @IsInt()
    @IsNotEmpty()
    id:number;

    @IsString()
    @IsNotEmpty()
    @MaxLength(100)
    kategorija: string; 
}