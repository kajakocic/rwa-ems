import { IsEmail, IsEnum, IsOptional, IsString, Matches, MinLength } from 'class-validator';
import { UserType } from 'src/common/enums/user-type.enum';

export class UpdateUserDto {
    @IsString()
    @IsOptional()
    name?: string;

    @IsString()
    @IsOptional()
    lastName?: string;

    @IsEmail()
    @IsOptional()
    email?: string;

    @IsString()
    @MinLength(6, { message: 'Lozinka mora imati najmanje 6 karaktera.' })
    @Matches(/[A-Z]/, { message: 'Lozinka mora sadržati barem jedno veliko slovo.' })
    @Matches(/[0-9]/, { message: 'Lozinka mora sadržati barem jedan broj.' })
    @Matches(/[^A-Za-z0-9]/, { message: 'Lozinka mora sadržati barem jedan specijalni znak.' })
    @IsOptional()
    password?: string;

    @IsEnum(UserType)
    @IsOptional()
    tip?: UserType;
}