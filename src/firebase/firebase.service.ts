import { Injectable } from '@nestjs/common';
import { CreateFirebaseDto } from './dto/create-firebase.dto';
import { UpdateFirebaseDto } from './dto/update-firebase.dto';
import { ConfigService } from '@nestjs/config';
import { initializeApp } from 'firebase-admin/app';
import * as admin from 'firebase-admin'
import { request } from 'http';
import { config } from "dotenv";
config();



@Injectable()
export class FirebaseService {
  constructor(private readonly configService: ConfigService) {
  }


  create(token: string) {
    admin.auth().verifyIdToken(token)
  .then((userRecord) => {
    console.log(userRecord)
  })
  .catch((error) => {
    console.log('Error fetching user data:', error);
  });
  }


  async verifyToken(token: string, email: string) {
  const verification = await admin.auth().verifyIdToken(token)
  if (verification && verification.email === email) {
    return true
  }
  return false
  }

  findOne(id: string) {

    admin.auth().getUser(id)
  .then((userRecord) => {
    console.log(`Successfully fetched user data: ${userRecord.toJSON()}`);
    console.log(userRecord)
  })
  .catch((error) => {
    console.log('Error fetching user data:', error);
  });

  }

}