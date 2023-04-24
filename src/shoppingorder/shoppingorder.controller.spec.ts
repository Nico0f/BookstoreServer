import { Test, TestingModule } from '@nestjs/testing';
import { ShoppingorderController } from './shoppingorder.controller';
import { ShoppingorderService } from './shoppingorder.service';

describe('ShoppingorderController', () => {
  let controller: ShoppingorderController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ShoppingorderController],
      providers: [ShoppingorderService],
    }).compile();

    controller = module.get<ShoppingorderController>(ShoppingorderController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
