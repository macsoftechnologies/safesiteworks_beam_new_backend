import {
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  UpdateEvent,
  RemoveEvent,
  DataSource,
} from 'typeorm';
import { Injectable } from '@nestjs/common';
import { RedisCacheService } from './redid-cache.service';

@Injectable()
@EventSubscriber()
export class DatabaseCacheSubscriber implements EntitySubscriberInterface {
  constructor(
    private readonly dataSource: DataSource,
    private readonly redisCacheService: RedisCacheService,
  ) {
    this.dataSource.subscribers.push(this);
  }

  afterInsert(event: InsertEvent<any>) {
    this.invalidate(event.metadata.tableName);
  }

  afterUpdate(event: UpdateEvent<any>) {
    this.invalidate(event.metadata.tableName);
  }

  afterRemove(event: RemoveEvent<any>) {
    this.invalidate(event.metadata.tableName);
  }

  private invalidate(tableName: string) {
    console.log(`⚡ TypeORM Change detected on table: ${tableName}. Invalidating cache...`);
    this.redisCacheService.deleteByPattern(`${tableName}:*`).catch((err) => {
      console.error(`Failed to invalidate cache for table ${tableName}:`, err);
    });
  }
}
