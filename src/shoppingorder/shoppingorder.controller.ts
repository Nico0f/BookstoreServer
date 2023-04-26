import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ShoppingorderService } from './shoppingorder.service';
import { CreateShoppingorderDto } from './dto/create-shoppingorder.dto';
import { UpdateShoppingorderDto } from './dto/update-shoppingorder.dto';

@Controller('shoppingorder')
export class ShoppingorderController {
  constructor(private readonly shoppingorderService: ShoppingorderService) {}

}
