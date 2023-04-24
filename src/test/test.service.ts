import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { CreateTestDto } from './dto/create-test.dto';
import { UpdateTestDto } from './dto/update-test.dto';
import { Cache } from 'cache-manager'

@Injectable()
export class TestService {

  constructor(@Inject(CACHE_MANAGER) private readonly cache: Cache) {}

  async get(createTestDto: CreateTestDto) {
    const { key, value } = createTestDto
    console.log(`GET ${key} from REDIS`);
    return await this.cache.get(key)
  }

  async set(createTestDto: CreateTestDto) {
    const { key, value } = createTestDto
    console.log(`SET ${key} from REDIS`);
    await this.cache.set(key, value);
  }
}
