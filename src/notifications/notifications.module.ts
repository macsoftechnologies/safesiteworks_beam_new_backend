import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notification } from './entities/notification.entity';
import { NotificationSetting } from './entities/notification-setting.entity';
import { NotificationsService } from './notifications.service';
import { NotificationsController } from './notifications.controller';
import { User } from '../users/entities/user.entity';
import { Employee } from '../employees/entities/employee.entity';
import { Subcontractor } from '../subcontractor/entities/subcontractor.entity';
import { RequestEntity } from '../requests/entities/request.entity';
import { RedisModule } from '../redis/redis.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Notification,
      NotificationSetting,
      User,
      Employee,
      Subcontractor,
      RequestEntity,
    ]),
    RedisModule,
  ],
  controllers: [NotificationsController],
  providers: [NotificationsService],
  exports: [NotificationsService],
})
export class NotificationsModule {}
