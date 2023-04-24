import { ConfigService } from '@nestjs/config';
import { Module, CacheModule } from '@nestjs/common';
import { TestService } from './test.service';
import { TestController } from './test.controller';
import { redisStore } from 'cache-manager-redis-yet'

// import type { RedisClientOptions } from 'redis';

@Module({
  imports: [
    CacheModule.registerAsync({
      useFactory: async (configService: ConfigService) => ({
       store: await redisStore({
        // url: configService.get('')
       })
      }),
      isGlobal: true,
      inject: [ConfigService],

      // Store-specific configuration:
      // host: 'localhost',
      // port: 6379,
    }),
  ],
  controllers: [TestController],
  providers: [TestService]
})
export class TestModule {}
