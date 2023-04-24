import { Controller, Get, Post, Body, Patch, Param, Delete, Req } from '@nestjs/common';
import { OrdercartService } from './ordercart.service';
import { CreateOrdercartDto } from './dto/create-ordercart.dto';
import { UpdateOrdercartDto } from './dto/update-ordercart.dto';
import { CustomRequest } from 'src/middleware/types';

@Controller('ordercart')
export class OrdercartController {
  constructor(private readonly ordercartService: OrdercartService) {}

  @Post()
  create(@Req() request: CustomRequest, @Body() createOrdercartDto: CreateOrdercartDto) {
    return this.ordercartService.create(request, createOrdercartDto);
  }

  @Get()
  findAll() {
    return this.ordercartService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ordercartService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOrdercartDto: UpdateOrdercartDto) {
    return this.ordercartService.update(+id, updateOrdercartDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ordercartService.remove(+id);
  }
}
