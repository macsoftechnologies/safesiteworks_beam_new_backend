import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('user_logs')
export class UserLog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  action: string;

  @Column({ type: 'text', nullable: true })
  body: string;

  @Column({ nullable: true })
  method: string;

  @Column({ nullable: true })
  url: string;

  @Column({ nullable: true })
  status: string;

  @Column({ nullable: true })
  user: string;

  @Column({ nullable: true })
  timestamp: string;

  @CreateDateColumn()
  createdAt: Date;
}