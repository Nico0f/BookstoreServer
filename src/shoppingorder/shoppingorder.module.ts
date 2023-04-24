import { Module } from '@nestjs/common';
import { ShoppingorderService } from './shoppingorder.service';
import { ShoppingorderController } from './shoppingorder.controller';

@Module({
  controllers: [ShoppingorderController],
  providers: [ShoppingorderService]
})
export class ShoppingorderModule {}
