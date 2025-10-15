import { IsInt, IsNotEmpty, IsOptional, IsString, Max, MaxLength, Min } from "class-validator";

export class ReservationResponseDto {
    @IsInt()
    @IsNotEmpty()
    id: number;  // <-- DODAJ OVO

    @IsInt()
    @IsNotEmpty()
    userId: number;

    @IsString()
    @IsNotEmpty()
    userName: string;

    @IsInt()
    @IsNotEmpty()
    eventId: number;

    @IsString()
    @IsNotEmpty()
    @MaxLength(100)
    eventName: string;
    
    @IsInt()
    @Min(1)
    @Max(100000)
    brMesta: number;
}

//IReservation