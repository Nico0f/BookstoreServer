import { Injectable } from '@nestjs/common';
import { CreateShoppingorderDto } from './dto/create-shoppingorder.dto';
import { UpdateShoppingorderDto } from './dto/update-shoppingorder.dto';

@Injectable()
export class ShoppingorderService {
  create(createShoppingorderDto: CreateShoppingorderDto) {
    return 'This action adds a new shoppingorder';
  }

  findAll() {
    return `This action returns all shoppingorder`;
  }

  findOne(id: number) {
    return `This action returns a #${id} shoppingorder`;
  }

  update(id: number, updateShoppingorderDto: UpdateShoppingorderDto) {
    return `This action updates a #${id} shoppingorder`;
  }

  remove(id: number) {
    return `This action removes a #${id} shoppingorder`;
  }
}
