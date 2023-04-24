import { Test, TestingModule } from '@nestjs/testing';
import { OrdercartController } from './ordercart.controller';
import { OrdercartService } from './ordercart.service';

describe('OrdercartController', () => {
  let controller: OrdercartController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrdercartController],
      providers: [OrdercartService],
    }).compile();

    controller = module.get<OrdercartController>(OrdercartController);
  });
  
  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
