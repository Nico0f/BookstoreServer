import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ShoppingorderService } from './shoppingorder.service';
import { CreateShoppingorderDto } from './dto/create-shoppingorder.dto';
import { UpdateShoppingorderDto } from './dto/update-shoppingorder.dto';

@Controller('shoppingorder')
export class ShoppingorderController {
  constructor(private readonly shoppingorderService: ShoppingorderService) {}

  @Post()
  create(@Body() createShoppingorderDto: CreateShoppingorderDto) {
    return this.shoppingorderService.create(createShoppingorderDto);
  }

  @Get()
  findAll() {
    return this.shoppingorderService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.shoppingorderService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateShoppingorderDto: UpdateShoppingorderDto) {
    return this.shoppingorderService.update(+id, updateShoppingorderDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.shoppingorderService.remove(+id);
  }
}
