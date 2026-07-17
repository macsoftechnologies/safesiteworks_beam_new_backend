import { Entity, Column, PrimaryGeneratedColumn, Unique } from 'typeorm';

@Entity('notification_settings')
@Unique(['userId', 'permitStatus'])
export class NotificationSetting {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'userId', type: 'int' })
  userId: number;

  @Column({ name: 'permitStatus', type: 'varchar', length: 100 })
  permitStatus: string;

  @Column({ type: 'tinyint', default: 1 })
  enabled: number; // 1 = ON, 0 = OFF
}
