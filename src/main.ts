import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import * as cookieParser from 'cookie-parser';
import { config } from "dotenv";
config();

import admin from 'firebase-admin'


async function bootstrap() {
  
  const app = await NestFactory.create(AppModule);
  // app.enableCors({credentials: true, origin: 'http://localhost:3000'});
  app.enableCors({credentials: true, origin: 'https://bookstore-nico0f.vercel.app'});
  
  app.use(cookieParser());
  const configService = app.get(ConfigService);


  const firebase = `{"type":"${configService.get<string>('TYPE')}","project_id":"${configService.get<string>('PROJECT_ID')}","private_key_id":"${configService.get<string>('PRIVATE_KEY_ID')}","private_key":"${configService.get<string>('PRIVATE_KEY')}","client_email":"${configService.get<string>('CLIENT_EMAIL')}","client_id":"${configService.get<string>('CLIENT_ID')}","auth_uri":"${configService.get<string>('AUTH_URI')}","token_uri":"${configService.get<string>('TOKEN_URI')}","auth_provider_x509_cert_url":"${configService.get<string>('AUTH_PROVIDER_X509_CERT_URL')}","client_x509_cert_url":"${configService.get<string>('CLIENT_X509_CERT_URL')}"}`

  
  admin.initializeApp({
    // credential: admin.credential.cert(JSON.parse(process.env.FIREBASE)),
    credential: admin.credential.cert(JSON.parse(firebase)),
    databaseURL: "https://bookstore-3d941-default-rtdb.firebaseio.com"
  });
  const port = configService.get<number>('PORT', 3001);
  // app.useGlobalPipes(new ValidationPipe());
  await app.listen(port);
}
bootstrap();
