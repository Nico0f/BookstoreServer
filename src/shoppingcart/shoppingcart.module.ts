import { Module } from '@nestjs/common';
import { ShoppingcartService } from './shoppingcart.service';
import { ShoppingcartController } from './shoppingcart.controller';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [ShoppingcartController],
  providers: [ShoppingcartService, PrismaService]
})
export class ShoppingcartModule {}
