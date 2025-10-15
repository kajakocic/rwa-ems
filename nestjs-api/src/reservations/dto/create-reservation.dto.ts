import { IsInt, IsNotEmpty, Min, Max, IsOptional } from 'class-validator';

export class CreateReservationDto {

  @IsInt()
  @IsNotEmpty()
  userId: number;

  @IsInt()
  @IsNotEmpty()
  eventId: number;

  @IsInt()
  @Min(1)
  @Max(100000)
  @IsOptional()
  brMesta?: number;
}