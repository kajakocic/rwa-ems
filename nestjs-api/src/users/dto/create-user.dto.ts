import { IsEmail, IsEnum, IsNotEmpty, IsString, Matches, MinLength } from 'class-validator';
import { UserType } from 'src/common/enums/user-type.enum';

export class CreateUserDto {

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @MinLength(6, { message: 'Lozinka mora imati najmanje 6 karaktera.' })
  @Matches(/[A-Z]/, { message: 'Lozinka mora sadržati barem jedno veliko slovo.' })
  @Matches(/[0-9]/, { message: 'Lozinka mora sadržati barem jedan broj.' })
  @Matches(/[^A-Za-z0-9]/, { message: 'Lozinka mora sadržati barem jedan specijalni znak.' })
  password: string;

  @IsEnum(UserType)
  tip: UserType;
}