import { Controller, Get, Post, Body, Query, Patch, Param, Delete, ParseIntPipe, Req } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { BooksService } from './books.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { CustomRequest } from 'src/middleware/types';

@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}
  
  @Get('alls')
  addAll(@Body() books) {
    return this.booksService.addAll(books)
    // return this.booksService.clean()
  }
  
  @Get('fiction')
  getFictionPage() {
    return this.booksService.getFictionPage()
  }

  @Get('nonfiction')
  getNonFictionPage() {
    return this.booksService.getNonFictionPage()
  }

  @Get('kids')
  getKidsPage() {
    return this.booksService.getKidsPage()
  }

  @Get('newarrivals')
  newArrivalsPage() {
    return this.booksService.newArrivalsPage()
  }


  @Get()
  findAll() {
    // return this.booksService.addAll();
    return this.booksService.findAll();
  }

  @Get('display')
  getDisplay(@Query() query: {pagination: string, type: string, genres: string, order: string}) {
    return this.booksService.getDisplay(query);
  }

  @Get('search')
  getSearch(@Query() query: {search: string, pagination: string, type: string, genre: number[], order: string}) {
    return this.booksService.getSearch(query);
  }

  @Get('display/nonfiction')
  getNonFiction() {
    return this.booksService.getNonFiction();
  }
  
  @Get('homepage')
  homepage() {
    return this.booksService.bringHomepage();
  }

  @Get('related')
  findRelated(@Query() query: {id: string}) {
    const { id } = query
    return this.booksService.findRelated(Number(id));
  }
  
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.booksService.findOne(+id);
  }
  
  
  @Post()
  create(@Body() createBookDto: CreateBookDto) {
    return this.booksService.create(createBookDto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBookDto: UpdateBookDto) {
    return this.booksService.update(+id, updateBookDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.booksService.remove(+id);
  }

  @Post('clean')
  clean() {
    return this.booksService.clean()
  }

}