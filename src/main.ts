import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import * as cookieParser from 'cookie-parser';

import admin from 'firebase-admin'

var serviceAccount = require("../bookstore-3d941-firebase-adminsdk-7ro90-ecc0538071.json");

async function bootstrap() {

  const app = await NestFactory.create(AppModule);
  app.enableCors({credentials: true, origin: 'http://localhost:3000'});
  app.use(cookieParser());
  const configService = app.get(ConfigService);
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://bookstore-3d941-default-rtdb.firebaseio.com"
  });
  const port = configService.get<number>('PORT', 3001);
  // app.useGlobalPipes(new ValidationPipe());
  await app.listen(port);
}
bootstrap();
