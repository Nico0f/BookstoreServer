import { Controller, Body, Post, ValidationPipe, Get, Req, HttpCode, HttpStatus, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpUserDto } from './dto/signup-user.dto'
import { SignInUserDto, SignInUserFirebaseDto } from './dto/singin-user.dto';
import { Request, Response } from 'express'
import { SignInResponse, Tokens } from './types';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post('local/signup')
    @HttpCode(HttpStatus.CREATED)
    signup(@Body(new ValidationPipe()) signUpUserDto: SignUpUserDto) {
        return this.authService.signup(signUpUserDto);
    }
    
    @Post('firebase/signin')
    @HttpCode(HttpStatus.CREATED)
    signinFirebase(@Body(new ValidationPipe()) signInUserFirebaseDto: SignInUserFirebaseDto) {
        return this.authService.signinFirebase(signInUserFirebaseDto);
    }


    @Post('local/signin')
    @HttpCode(HttpStatus.OK)
    async singin(@Res({ passthrough: true }) response: Response, @Body(new ValidationPipe()) signInUserDto: SignInUserDto): Promise<SignInResponse> {
        return this.authService.signin(signInUserDto, response);
    }

    @Post('local/status')
    @HttpCode(HttpStatus.OK)
    async checkStatus(@Res({ passthrough: true }) response: Response, @Req() request: Request): Promise<any> {
        return this.authService.checkStatus(request, response);
    }

}
