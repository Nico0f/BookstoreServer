import { Test, TestingModule } from '@nestjs/testing';
import { OrdercartService } from './ordercart.service';

describe('OrdercartService', () => {
  let service: OrdercartService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OrdercartService],
    }).compile();

    service = module.get<OrdercartService>(OrdercartService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
