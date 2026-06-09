import { Global, Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-ioredis-yet';
import { RedisCacheService } from './redid-cache.service';
import { DatabaseCacheSubscriber } from './database-cache.subscriber';

@Global()
@Module({
  imports: [
    CacheModule.registerAsync({
      isGlobal: true,
      useFactory: async () => ({
        store: await redisStore({
          host: '127.0.0.1',
          port: 6379,
        }),

        ttl: 60,
      }),
    }),
  ],
  providers: [RedisCacheService, DatabaseCacheSubscriber],
  exports: [
    CacheModule,
    RedisCacheService,
  ],
})
export class RedisModule {}