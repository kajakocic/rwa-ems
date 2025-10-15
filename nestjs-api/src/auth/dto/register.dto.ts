import { IsEmail, IsEnum, IsInt, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { UserType } from '../../common/enums/user-type.enum';
import { Type } from 'class-transformer';

export class RegisterDto {
  @IsString()
  @IsNotEmpty()
  ime: string;

  @IsString()
  @IsNotEmpty()
  prezime: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @Type(() => Number)  
  @IsInt()
  @IsEnum(UserType)
  tip: UserType;
}

