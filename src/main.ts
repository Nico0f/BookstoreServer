import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import * as cookieParser from 'cookie-parser';
import { config } from "dotenv";
config();

import admin from 'firebase-admin'

// var serviceAccount = require(process.env.FIREBASE_SERVICE_ACCOUNT_KEY_PATH);

async function bootstrap() {

  const app = await NestFactory.create(AppModule);
  app.enableCors({credentials: true, origin: 'http://localhost:3000'});
  app.use(cookieParser());
  const configService = app.get(ConfigService);
  admin.initializeApp({
    credential: admin.credential.cert(JSON.parse(process.env.FIREBASE)),
    databaseURL: "https://bookstore-3d941-default-rtdb.firebaseio.com"
  });
  const port = configService.get<number>('PORT', 3001);
  // app.useGlobalPipes(new ValidationPipe());
  await app.listen(port);
}
bootstrap();
