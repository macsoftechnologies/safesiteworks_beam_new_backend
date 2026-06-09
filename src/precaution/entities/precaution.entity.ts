import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('precautions')
export class Precaution {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'precaution', type: 'text', nullable: false })
  precaution: string;

  @Column({ name: 'createdTime', type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  createdTime: Date;
}
