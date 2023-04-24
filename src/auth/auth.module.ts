import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { FirebaseService } from 'src/firebase/firebase.service';

@Module({
  imports:[JwtModule.register({})],
  controllers: [AuthController],
  providers: [AuthService, PrismaService, FirebaseService]
})
export class AuthModule {}
