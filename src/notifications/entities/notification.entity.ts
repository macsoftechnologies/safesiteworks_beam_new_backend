import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('notifications')
export class Notification {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'receiverUserId', type: 'int' })
  receiverUserId: number;

  @Column({ name: 'senderUserId', type: 'int', nullable: true })
  senderUserId?: number;

  @Column({ name: 'permitRequestId', type: 'int', nullable: true })
  permitRequestId?: number;

  @Column({ name: 'companyId', type: 'int', nullable: true })
  companyId?: number;

  @Column({ name: 'notificationType', type: 'varchar', length: 100, nullable: true })
  notificationType?: string;

  @Column({ name: 'permitStatus', type: 'varchar', length: 100, nullable: true })
  permitStatus?: string;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'text' })
  message: string;

  @Column({ name: 'isRead', type: 'tinyint', default: 0 })
  isRead: number;

  @CreateDateColumn({ name: 'createdAt' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updatedAt' })
  updatedAt: Date;

  @Column({ type: 'text', nullable: true })
  metadata?: string;
}
