import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('electrical_works')
export class ElectricalWork {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'electrical_works', type: 'text', nullable: false })
  electrical_works: string;

  @Column({ name: 'createdTime', type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  createdTime: Date;

  @Column({ name: 'module', type: 'varchar', length: 200, nullable: true })
  module?: string;
}
