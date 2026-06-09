import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('activities')
export class Activity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'activityName', type: 'varchar', length: 150, nullable: false })
  activityName: string;

  @Column({ name: 'createdTime', type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  createdTime: Date;
}
