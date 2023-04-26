import { Controller, Get, Post, Body, Patch, Param, Delete, Req } from '@nestjs/common';
import { OrdercartService } from './ordercart.service';
import { CreateOrdercartDto } from './dto/create-ordercart.dto';
import { CustomRequest } from 'src/middleware/types';

@Controller('ordercart')
export class OrdercartController {
  constructor(private readonly ordercartService: OrdercartService) {}

  @Post()
  create(@Req() request: CustomRequest, @Body() createOrdercartDto: CreateOrdercartDto) {
    return this.ordercartService.create(request, createOrdercartDto);
  }
}
