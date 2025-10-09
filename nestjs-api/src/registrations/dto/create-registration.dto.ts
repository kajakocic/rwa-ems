import { IsInt, IsNotEmpty, Min, Max, IsOptional } from 'class-validator';

export class CreateRegistrationDto {
  @IsInt()
  @IsNotEmpty()
  eventId: number;

  @IsInt()
  @IsNotEmpty()
  userId: number;

  @IsInt()
  @Min(1)
  @Max(100000)
  @IsOptional()
  capacity?: number;
}