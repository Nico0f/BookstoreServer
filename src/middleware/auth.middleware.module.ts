import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { MiddlewareService } from './auth.service.middleware';
import { JwtModule, JwtService } from '@nestjs/jwt';

@Module({
//   controllers: [BooksController],
  imports:[JwtModule.register({})],
  providers: [MiddlewareService, PrismaService]
})
export class MiddlewareModule {}