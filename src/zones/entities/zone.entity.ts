import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Floor } from '../../floor/entities/floor.entity';

@Entity('zones')
export class Zone {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'level', type: 'varchar', length: 255, nullable: true })
  level?: string;

  @Column({ name: 'zone', type: 'varchar', length: 255, nullable: false })
  zone: string;

  @Column({ name: 'building_id', type: 'int', nullable: true })
  building_id?: number;

  @Column({ name: 'status', type: 'varchar', length: 255, nullable: true })
  status?: string;

  @Column({ name: 'floor_id', type: 'int', nullable: true })
  floor_id?: number;

  @ManyToOne(() => Floor, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'floor_id' })
  floor?: Floor;
}
