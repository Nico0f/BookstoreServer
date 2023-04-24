import { IsEmail, MinLength, IsNotEmpty } from 'class-validator';

export class CreateUserDto {

    @MinLength(2)
    @IsNotEmpty()
    firstName: string;

    @MinLength(2)
    @IsNotEmpty()
    lastName: string;

    @IsEmail()
    @IsNotEmpty()
    email: string;
    
    @IsNotEmpty()
    password: string;
}