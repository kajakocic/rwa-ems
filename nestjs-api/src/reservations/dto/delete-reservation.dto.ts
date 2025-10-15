import { IsInt, IsNotEmpty, IsOptional, Max, Min } from "class-validator";
import { PrimaryColumn } from "typeorm";

export class DeleteReservationDto {
    
    @IsInt()
    @IsNotEmpty()
    id:number;

    @IsInt()
    @IsNotEmpty()
    userId: number;

    @IsInt()
    @IsNotEmpty()
    eventId: number;

    @IsInt()
    @Min(1)
    @Max(100000)
    brMesta: number;
}