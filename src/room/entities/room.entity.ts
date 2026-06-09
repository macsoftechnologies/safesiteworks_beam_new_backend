import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Floor } from '../../floor/entities/floor.entity';

@Entity('rooms')
export class Room {
  @PrimaryGeneratedColumn({ name: 'room_id' })
  room_id: number;

  @Column({ name: 'room_name', type: 'varchar', length: 255, nullable: false })
  room_name: string;

  @Column({ name: 'room_status', type: 'varchar', length: 255, nullable: true })
  room_status?: string;

  @Column({ name: 'room_image', type: 'varchar', length: 500, nullable: true })
  room_image?: string;

  @Column({ name: 'fl_id', type: 'int', nullable: false })
  fl_id: number;

  @ManyToOne(() => Floor, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'fl_id' })
  floor?: Floor;
}
