import { Controller, Get, Post, Body, Patch, Param, Delete, Req, ParseIntPipe } from '@nestjs/common';
import { ShoppingcartService } from './shoppingcart.service';
import { CreateShoppingcartDto } from './dto/create-shoppingcart.dto';
import { UpdateShoppingcartDto } from './dto/update-shoppingcart.dto';
import { CustomRequest } from 'src/middleware/types';

@Controller('shoppingcart')
export class ShoppingcartController {
  constructor(private readonly shoppingcartService: ShoppingcartService) {}

  @Post('/:id')
  create(@Param('id', ParseIntPipe) bookId: number, @Req() request: CustomRequest) {
    return this.shoppingcartService.create(bookId, request);
  }

  @Get()
  findAll(@Req() request: CustomRequest) {
    return this.shoppingcartService.findAll(request);
  }


  @Patch(':id')
  update(@Param('id') id: string, @Body() updateShoppingcartDto: UpdateShoppingcartDto) {
    return this.shoppingcartService.update(+id, updateShoppingcartDto);
  }

  @Delete(':id')
  removeOne(@Param('id', ParseIntPipe) bookId: number, @Req() request: CustomRequest) {
    return this.shoppingcartService.removeOne(+bookId, request);
  }

  @Delete('')
  remove(@Req() request: CustomRequest) {
    return this.shoppingcartService.remove(request);
  }
}
