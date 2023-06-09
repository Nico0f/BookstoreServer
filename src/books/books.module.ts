import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { Module } from '@nestjs/common';
import { BooksService } from './books.service';
import { BooksController } from './books.controller';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [BooksController],
  providers: [BooksService, PrismaService, CloudinaryService]
})
export class BooksModule {}
