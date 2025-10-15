import { Type } from 'class-transformer';
import { IsEmail, IsEnum, IsInt, IsNotEmpty, IsString, Matches, MinLength } from 'class-validator';
import { UserType } from 'src/common/enums/user-type.enum';

export class CreateUserDto {

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
  @MinLength(6, { message: 'Lozinka mora imati najmanje 6 karaktera.' })
  @Matches(/[A-Z]/, { message: 'Lozinka mora sadržati barem jedno veliko slovo.' })
  @Matches(/[0-9]/, { message: 'Lozinka mora sadržati barem jedan broj.' })
  @Matches(/[^A-Za-z0-9]/, { message: 'Lozinka mora sadržati barem jedan specijalni znak.' })
  password: string;

  @Type(() => Number)  
  @IsInt()
  @IsEnum(UserType)
  tip: UserType;
}