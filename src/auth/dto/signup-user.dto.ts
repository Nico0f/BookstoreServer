import { IsEmail, IsNotEmpty, IsString, Length, MinLength } from "class-validator";



export class SignUpUserDto {
    @IsNotEmpty()
    @IsString()
    @Length(2, 20)
    firstName: string;

    @IsNotEmpty()
    @IsString()
    @Length(2, 20)
    lastName: string;

    @IsNotEmpty()
    @IsEmail()
    email: string;
    
    @IsNotEmpty()
    @IsString()
    @MinLength(6)
    password: string;
}