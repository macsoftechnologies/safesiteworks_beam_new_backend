import { Global, Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-ioredis-yet';
import { RedisCacheService } from './redid-cache.service';
import { DatabaseCacheSubscriber } from './database-cache.subscriber';
import * as net from 'net';

function checkRedisAlive(port = 6379, host = '127.0.0.1'): Promise<boolean> {
  return new Promise((resolve) => {
    const socket = new net.Socket();
    socket.setTimeout(1000); // 1-second timeout

    socket.once('connect', () => {
      socket.destroy();
      resolve(true);
    });

    socket.once('timeout', () => {
      socket.destroy();
      resolve(false);
    });

    socket.once('error', () => {
      socket.destroy();
      resolve(false);
    });

    socket.connect(port, host);
  });
}

@Global()
@Module({
  imports: [
    CacheModule.registerAsync({
      isGlobal: true,
      useFactory: async () => {
        const isRedisAlive = await checkRedisAlive(6379, '127.0.0.1');

        if (isRedisAlive) {
          try {
            console.log('🔌 Redis server detected. Initializing Redis cache store...');
            const store = await redisStore({
              host: '127.0.0.1',
              port: 6379,
            });

            // Gracefully handle Redis connection errors after initialization
            store.client.on('error', (err) => {
              console.warn(`Redis connection error: ${err.message}`);
            });

            return {
              store,
              ttl: 60,
            };
          } catch (err) {
            console.error('Failed to initialize Redis store, falling back to in-memory cache:', err);
          }
        }

        console.warn('⚠️ Local Redis server not detected at 127.0.0.1:6379. Falling back to in-memory cache.');
        return {
          ttl: 60,
        };
      },
    }),
  ],
  providers: [RedisCacheService, DatabaseCacheSubscriber],
  exports: [
    CacheModule,
    RedisCacheService,
  ],
})
export class RedisModule {}