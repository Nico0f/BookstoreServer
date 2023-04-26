import { Controller, Get, Post, Body, Patch, Param, Delete, Req, ParseIntPipe, UseInterceptors, UploadedFile } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { CustomRequest } from 'src/middleware/types';
import { FileInterceptor } from '@nestjs/platform-express';
import { DeleteAvatarDto } from './dto/remove-avatar.dto';
import { ConfigService } from '@nestjs/config';
import * as cloudinary from 'cloudinary';
import * as multer from 'multer';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix + '.' + file.originalname.split('.').pop());
  },
});

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService,
    private readonly configService: ConfigService) {
    cloudinary.v2.config({
      cloud_name: this.configService.get<string>('CLOUDINARY_CLOUD_NAME'),
      api_key: this.configService.get<string>('CLOUDINARY_API_KEY'),
      api_secret: this.configService.get<string>('CLOUDINARY_API_SECRET'),
    }); }



  @Get('current')
  findCurrent(@Req() request: CustomRequest) {
    return this.usersService.findCurrent(request);
  }





  
  @Patch('avatar')
  @UseInterceptors(FileInterceptor('image', { storage }))
  update(@Req() request: CustomRequest, @UploadedFile() file: Express.Multer.File, updateUserDto: UpdateUserDto) {
    return this.usersService.uploadAvatar(request, file);
  }
  
  @Delete('avatar')
  removeAvatar(@Body() data: DeleteAvatarDto, @Req() request: CustomRequest) {
    return this.usersService.removeAvatar(request, data);
  }
  
  

}
