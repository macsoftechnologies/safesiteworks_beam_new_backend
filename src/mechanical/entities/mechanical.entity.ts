import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('mechanical_works')
export class MechanicalWork {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'mechanical_works', type: 'text', nullable: false })
  mechanical_works: string;

  @Column({ name: 'createdTime', type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  createdTime: Date;
}
