import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma.service';
import { Prisma } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { CustomRequest } from 'src/middleware/types';
import { connect } from 'http2';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { DeleteAvatarDto } from './dto/remove-avatar.dto';
import * as fs from 'fs';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService,
    private cloudinary: CloudinaryService) { }



  async findCurrent(request: CustomRequest) {
    const userId = request.user

    if (request.payload.message === 'Access granted') {
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
        select: {
          firstName: true,
          lastName: true,
          email: true,
          avatar: true,
          phone: true
        }
      });
      return {
        message: 'User retrieved',
        user
      }
    } else if (request.payload.message === 'New tokens') {
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
        select: {
          firstName: true,
          lastName: true,
          email: true,
          avatar: true,
          phone: true
        }
      });
      return {
        message: 'User retrieved, New tokens',
        firstName: request.payload.firstName,
        lastName: request.payload.lastName,
        avatar: request.payload.avatar,
        accessToken: request.payload.accessToken,
        user
      }
    }
  }
  async update(request: CustomRequest, updateUserDto: UpdateUserDto) {
    const userId = request.user
    const updateinfo: UpdateUserDto = request.body

    if (request.payload.message === 'Access granted') {
      const user = await this.prisma.user.update({
        where: { id: userId },
        data: updateinfo,
      });
      return {
        message: 'Successful update',
        user
      }
    } else if (request.payload.message === 'New tokens') {
      const user = await this.prisma.user.update({
        where: { id: userId },
        data: updateinfo,
      });
      return {
        message: 'Successful update, New tokens',
        accessToken: request.payload.accessToken,
        user
      }
    }
  }


  async uploadAvatar(request: CustomRequest, file: Express.Multer.File) {
    const userId = request.user
    const oldUrl = request.body.oldImage
    
    if (request.payload.message === 'Access granted') {
      
      const uploadImageUrl = await this.cloudinary.uploadImage(file)
      
      const updatedUser = await this.prisma.user.update({
        where: {
          id: userId
        },
        data: {
          avatar: uploadImageUrl
        }
      })

      fs.unlink(file.path, (err) => {
        if (err) {
         console.error(err);
         return err;
        }
       });

       const deleteOldUrl = await this.cloudinary.deleteAvatar(oldUrl)
      return {
        message: 'Avatar created',
        image: uploadImageUrl
      }
    } else if (request.payload.message === 'New tokens') {
      const uploadImageUrl = await this.cloudinary.uploadImage(file)
      
      const updatedUser = await this.prisma.user.update({
        where: {
          id: userId
        },
        data: {
          avatar: uploadImageUrl
        }
      })
      fs.unlink(file.path, (err) => {
        if (err) {
         console.error(err);
         return err;
        }
       });
       const deleteOldUrl = await this.cloudinary.deleteAvatar(oldUrl)
      return {
        message: 'Avatar created, New tokens',
        image: uploadImageUrl,
        accessToken: request.payload.accessToken
      }
    }
    }


  async removeAvatar(request: CustomRequest, data: DeleteAvatarDto) {
    const userId = request.user
    const url = data.url

    if (request.payload.message === 'Access granted') {
      const deleteAvatar = await this.cloudinary.deleteAvatar(url)
      console.log(deleteAvatar)
      if (deleteAvatar.result === 'ok') {
        const updatedUser = await this.prisma.user.update({
          where: {
            id: userId
          },
          data: {
            avatar: 'https://res.cloudinary.com/dgcsnhguo/image/upload/v1678391539/avatars/profile_vru7vi.png'
          }
        })
        return {
          message: 'Avatar deleted'
        }
      }
    } else if (request.payload.message === 'New tokens') {
      const deleteAvatar = await this.cloudinary.deleteAvatar(url)
      if (deleteAvatar.result === 'ok') {
        const updatedUser = await this.prisma.user.update({
          where: {
            id: userId
          },
          data: {
            avatar: 'https://res.cloudinary.com/dgcsnhguo/image/upload/v1678391539/avatars/profile_vru7vi.png'
          }
        })
        return {
          message: 'Avatar deleted, New tokens',
          accessToken: request.payload.accessToken
        }
      }
    }
  }

}
