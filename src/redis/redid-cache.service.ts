import {
  CACHE_MANAGER,
} from '@nestjs/cache-manager';

import {
  Inject,
  Injectable,
} from '@nestjs/common';

import type { Cache } from 'cache-manager';

@Injectable()
export class RedisCacheService {
  constructor(
    @Inject(CACHE_MANAGER)
    private cacheManager: Cache,
  ) {}

  async getOrSet<T>(
    key: string,
    cb: () => Promise<T>,
    ttl,
  ): Promise<T> {
    // ✅ CHECK CACHE
    const cachedData =
      await this.cacheManager.get<T>(key);

    if (cachedData) {
      console.log(
        `🟩 CACHE HIT: ${key}`,
      );

      return cachedData;
    }

    console.log(`🔥 DB HIT: ${key}`);

    // ✅ FETCH DATA
    const freshData = await cb();

    // ✅ STORE CACHE
    await this.cacheManager.set(
      key,
      freshData,
      ttl,
    );

    return freshData;
  }

  async delete(key: string) {
    await this.cacheManager.del(key);
  }

  async deleteByPattern(pattern: string) {
    const anyCache = this.cacheManager as any;
    let client: any = null;
    if (anyCache.store && anyCache.store.client) {
      client = anyCache.store.client;
    } else if (anyCache.stores && anyCache.stores[0]) {
      const firstStore = anyCache.stores[0];
      client = firstStore.client ?? (firstStore.store && firstStore.store.client);
    }

    if (client) {
      try {
        const keys = await client.keys(pattern);
        if (keys && keys.length > 0) {
          await client.del(...keys);
          console.log(`🧹 CACHE INVALIDATED: ${pattern} (${keys.length} keys deleted)`);
        }
      } catch (err) {
        console.error(`Failed to delete keys by pattern ${pattern}:`, err);
        await this.cacheManager.clear();
      }
    } else {
      await this.cacheManager.clear();
      console.log(`🧹 CACHE CLEARED (Fallback)`);
    }
  }

  async get<T>(key: string): Promise<T | undefined> {
    return this.cacheManager.get<T>(key);
  }

  async set<T>(key: string, value: T, ttl?: number): Promise<void> {
    await this.cacheManager.set(key, value, ttl);
  }
}