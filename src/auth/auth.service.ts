import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { SignUpUserDto } from './dto/signup-user.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt/dist';
import { SignInUserDto, SignInUserFirebaseDto } from './dto/singin-user.dto';
import { ConfigService } from '@nestjs/config';
import { JwtPayload } from './types';
import { Request, Response } from 'express'
import { FirebaseService } from 'src/firebase/firebase.service';
const crypto = require('crypto');

@Injectable()
export class AuthService {
    constructor(private prisma: PrismaService,
        private jwtService: JwtService,
        private config: ConfigService,
        private firebase: FirebaseService) { }


    async signup(signUpUserDto: SignUpUserDto) {
        const { firstName, lastName, email, password } = signUpUserDto
        let hashedPass = await this.hashPassword(password)
        const newUser = await this.prisma.user.create({
            data: {
                firstName,
                lastName,
                email,
                hashedPass,
                avatar: 'https://res.cloudinary.com/dgcsnhguo/image/upload/v1679007261/avatars/profile_nya3uu.png'
            }
        })
        return { message: 'User created' }
    }

    async signinFirebase(signInUserFirebaseDto: SignInUserFirebaseDto) {
        const { token, email, firstName, lastName, avatar } = signInUserFirebaseDto
        console.log(firstName)
        const user = await this.prisma.user.findUnique({
            where: {
                email
            }
        })
        if (user) {
            if (!user.isActive) throw new ForbiddenException('Account suspended')
            return {
                message: 'Successful Signin',
                firstName,
                lastName,
                avatar
            }
        } else {
            const verifyToken = await this.firebase.verifyToken(token, email)
            if (verifyToken) {
                const newUser = await this.prisma.user.create({
                    data: {
                        firstName,
                        lastName,
                        email,
                        avatar
                    }
                })
                return {
                    message: 'User created',
                    firstName,
                    lastName,
                    avatar
                }
            } else {
                throw new ForbiddenException('Access denied')
            }
        }
    }

    async signin(signInUserDto: SignInUserDto, response: Response) {
        const { email, password } = signInUserDto
        const user = await this.prisma.user.findUnique({
            where: {
                email
            }
        })
        if (!user) throw new ForbiddenException('Access denied')


        const passwordMatch = await bcrypt.compare(password, user.hashedPass)
        if (!passwordMatch) throw new ForbiddenException('Incorrect password')

        if (!user.isActive) throw new ForbiddenException('Account suspended')

        const tokens = await this.getTokens(user.id, user.email, user.role)

        response.cookie('refreshToken', tokens.refreshToken, {
            expires: new Date(new Date().getTime() + 15 * 24 * 60 * 60 * 1000),
            sameSite: 'strict',
            httpOnly: true,
        });

        return {
            message: 'Successful Signin',
            firstName: user.firstName,
            lastName: user.lastName,
            avatar: user.avatar,
            accessToken: tokens.accessToken
        }
    }

    async checkStatus(request: Request, response: Response) {
        const accessToken = request?.get('authorization')?.replace('Bearer', '').trim();
        const refreshToken = request?.cookies['refreshToken']

        if (!accessToken || !refreshToken) throw new ForbiddenException('Access denied')

        const decodedAToken = this.jwtService.decode(accessToken);
        const userId = decodedAToken['id'];
        console.log(userId)

        try {
            const checkAccessToken = await this.jwtService.verify(accessToken, {
                secret: this.config.get<string>('JWT_AT_SECRET'),
                algorithms: ['HS256'],
            })
            return { message: 'User authorized' }
        } catch {
            const user = await this.prisma.user.findUnique({
                where: {
                    id: userId
                }
            })

            if (user && user.isActive) {
                const decodedRToken = this.jwtService.decode(refreshToken);
                const checkRefreshToken = await this.jwtService.verify(refreshToken, {
                    secret: this.config.get<string>('JWT_RT_SECRET'),
                    algorithms: ['HS256'],
                })
                console.log('problema', decodedRToken['code'], decodedAToken['code'])
                if (checkRefreshToken && decodedRToken['code'] === decodedAToken['code']) {
                    const tokens = await this.getTokens(user.id, user.email, user.role)

                    response.cookie('refreshToken', tokens.refreshToken, {
                        expires: new Date(new Date().getTime() + 15 * 24 * 60 * 60 * 1000),
                        sameSite: 'strict',
                        httpOnly: true,
                    });

                    return {
                        message: 'User authorized, new tokens',
                        firstName: user.firstName,
                        lastName: user.lastName,
                        avatar: user.avatar,
                        accessToken: tokens.accessToken,
                    }
                } else {
                    throw new ForbiddenException('Session expired')
                }
            } else if (!user.isActive) {
                throw new ForbiddenException('Account suspended')
            }
        }
        return { message: 'User authorized' }
        // return true;
    }


    async getTokens(id: number, email: string, role: string) {
        var code = crypto.randomBytes(64).toString('hex');
        const jwtPayload: JwtPayload = {
            id,
            email,
            role,
            code,
        };

        const [accessToken, refreshToken] = await Promise.all([
            this.jwtService.signAsync(jwtPayload, {
                secret: this.config.get<string>('JWT_AT_SECRET'),
                expiresIn: '10m',
            }),
            this.jwtService.signAsync(jwtPayload, {
                secret: this.config.get<string>('JWT_RT_SECRET'),
                expiresIn: '14d',
            }),
        ]);

        return { accessToken, refreshToken }

    }


    hashPassword(data: string) {
        return bcrypt.hash(data, 10);
    }
}
