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
    try {
      // ✅ CHECK CACHE
      const cachedData = await this.cacheManager.get<T>(key);

      if (cachedData) {
        console.log(`🟩 CACHE HIT: ${key}`);
        return cachedData;
      }
    } catch (err) {
      console.warn(`⚠️ Cache check failed for key "${key}":`, err.message || err);
    }

    console.log(`🔥 DB HIT: ${key}`);

    // ✅ FETCH DATA
    const freshData = await cb();

    try {
      // ✅ STORE CACHE
      await this.cacheManager.set(
        key,
        freshData,
        ttl,
      );
    } catch (err) {
      console.warn(`⚠️ Cache store failed for key "${key}":`, err.message || err);
    }

    return freshData;
  }

  async delete(key: string) {
    try {
      await this.cacheManager.del(key);
    } catch (err) {
      console.warn(`⚠️ Cache delete failed for key "${key}":`, err.message || err);
    }
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
        try {
          await this.cacheManager.clear();
        } catch (clearErr) {
          console.error(`Failed to clear cache:`, clearErr);
        }
      }
    } else {
      try {
        await this.cacheManager.clear();
        console.log(`🧹 CACHE CLEARED (Fallback)`);
      } catch (clearErr) {
        console.error(`Failed to clear cache (Fallback):`, clearErr);
      }
    }
  }

  async get<T>(key: string): Promise<T | undefined> {
    try {
      return await this.cacheManager.get<T>(key);
    } catch (err) {
      console.warn(`⚠️ Cache get failed for key "${key}":`, err.message || err);
      return undefined;
    }
  }

  async set<T>(key: string, value: T, ttl?: number): Promise<void> {
    try {
      await this.cacheManager.set(key, value, ttl);
    } catch (err) {
      console.warn(`⚠️ Cache set failed for key "${key}":`, err.message || err);
    }
  }
}