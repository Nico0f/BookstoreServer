import { Test, TestingModule } from '@nestjs/testing';
import { ShoppingorderService } from './shoppingorder.service';

describe('ShoppingorderService', () => {
  let service: ShoppingorderService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ShoppingorderService],
    }).compile();

    service = module.get<ShoppingorderService>(ShoppingorderService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
