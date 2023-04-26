import { ForbiddenException, Injectable } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { JwtService } from '@nestjs/jwt/dist';
import { PrismaService } from 'src/prisma.service';
import { ConfigService } from '@nestjs/config';
import { JwtPayload } from 'src/auth/types';
import { CustomRequest } from './types';
import * as admin from 'firebase-admin'
const crypto = require('crypto');

@Injectable()
export class MiddlewareService {
    constructor(private prisma: PrismaService,
        private jwtService: JwtService,
        private config: ConfigService) { }

    async validate(request: CustomRequest, response: Response, next: NextFunction) {
        const accessToken = request?.get('authorization')?.replace('Bearer', '').trim();
        const refreshToken = request?.cookies['refreshToken']

        if (request.get('Token-type')) {
            const verification = await admin.auth().verifyIdToken(accessToken)
            const user = await this.prisma.user.findUnique({
                where: {
                    email: verification.email
                }
            })
            if (user && user.isActive) {
                request.user = user.id
                request.payload = {
                    message: 'Access granted'
                }
                return next()
            }
        }
        if (!accessToken || !refreshToken) throw new ForbiddenException('Access denied')
        const decodedAToken = this.jwtService.decode(accessToken);
        const userId = decodedAToken['id'];
        request.user = userId 
        try {
            const checkAccessToken = await this.jwtService.verify(accessToken, {
                secret: this.config.get<string>('JWT_AT_SECRET'),
                algorithms: ['HS256'],
            })
            request.payload = {
                message: 'Access granted'
            }
            return next()
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
                if (checkRefreshToken && decodedRToken['code'] === decodedAToken['code']) {     
                    const tokens = await this.getTokens(user.id, user.email, user.role)
                    request.payload = {
                        message: 'New tokens',
                        firstName: user.firstName,
                        lastName: user.lastName,
                        avatar: user.avatar,
                        accessToken: tokens.accessToken,
                    }     
                    response.cookie('refreshToken', tokens.refreshToken, {
                        expires: new Date(new Date().getTime() + 15 * 24 * 60 * 60 * 1000),
                        sameSite: 'strict',
                        httpOnly: true,
                    });     
                    return next()
                } else {  
                    throw new ForbiddenException('Session expired')
                }
            } else if (!user.isActive) {
                throw new ForbiddenException('Account suspended')
            }
        }
        return next()
    }



    async getTokens(id: number, email: string, role: string) {
        var code = crypto.randomBytes(64).toString('hex');
        const jwtPayload: JwtPayload = {
            id,
            email: email,
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
}