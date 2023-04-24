import { IsEmail, IsNotEmpty, IsString, Length, MinLength } from "class-validator";



export class SignInUserDto {
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(6)
    password: string;
}

export class SignInUserFirebaseDto {

    @IsNotEmpty()
    token: string;

    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    firstName: string;

    @IsNotEmpty()
    lastName: string;

    @IsNotEmpty()
    avatar: string;
}