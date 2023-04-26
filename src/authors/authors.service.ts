import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateAuthorDto } from './dto/create-author.dto';
import { UpdateAuthorDto } from './dto/update-author.dto';

@Injectable()
export class AuthorsService {
  constructor(private prisma: PrismaService) { }


  async findOne(id: number) {

    const author = await this.prisma.bookAuthor.findFirst({
      where: {
        bookId: id
      },
      select: {
        author: true
      }
    })

    return author;
  }

}
