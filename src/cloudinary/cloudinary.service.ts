import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as cloudinary from 'cloudinary';
import { Express } from 'express'

@Injectable()
export class CloudinaryService {
    constructor(private readonly configService: ConfigService) {
        cloudinary.v2.config({
          cloud_name: this.configService.get<string>('CLOUDINARY_CLOUD_NAME'),
          api_key: this.configService.get<string>('CLOUDINARY_API_KEY'),
          api_secret: this.configService.get<string>('CLOUDINARY_API_SECRET'),
        });
      }

      async uploadImage(file: Express.Multer.File) {
        const response = await cloudinary.v2.uploader.upload(file.path, {
          folder: 'avatars',
          use_filename: true,
        });
        return response.secure_url
      }

      async changeAvatar(file: Express.Multer.File, oldURL: string) {
        cloudinary.v2.uploader.destroy(oldURL)
        const newURL = await cloudinary.v2.uploader.upload(file.path);
        return newURL
      }
      
      async deleteAvatar(url: string) {
        let splitted = url.split("/")
        const publicId = splitted[url.split("/").length - 1]
        console.log(publicId)
        const response = await cloudinary.v2.uploader.destroy('avatars/' + publicId.split(".")[0])
        return response
      }

      async uploadCover(url) {
        const options = {
          use_filename: true,
          unique_filename: false,
          overwrite: true,
          folder: 'covers',
        };
      
        try {
          // Upload the image
          const result = await cloudinary.v2.uploader.upload(url, options);
          return result
        } catch (error) {
          console.log(error);
        }
      };
}
