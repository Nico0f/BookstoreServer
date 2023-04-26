import { Controller, Get, Post, Body, Patch, Param, Delete, Req } from '@nestjs/common';
import { FirebaseService } from './firebase.service';
import { CreateFirebaseDto } from './dto/create-firebase.dto';
import { UpdateFirebaseDto } from './dto/update-firebase.dto';

@Controller('firebase')
export class FirebaseController {
  constructor(private readonly firebaseService: FirebaseService) {}

  @Post()
  create(@Req() request: any, @Body() createFirebaseDto: CreateFirebaseDto) {
    const token = request.headers.token
    return this.firebaseService.create(token);

  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.firebaseService.findOne(id);
  }

}
