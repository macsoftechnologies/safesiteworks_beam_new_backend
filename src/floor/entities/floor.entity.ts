import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('floors')
export class Floor {
  @PrimaryGeneratedColumn({ name: 'fl_id' })
  fl_id: number;

  @Column({ name: 'floor_name', type: 'varchar', length: 255, nullable: false })
  floor_name: string;

  @Column({ name: 'floor_status', type: 'varchar', length: 255, nullable: true })
  floor_status?: string;

  @Column({ name: 'floor_image', type: 'varchar', length: 500, nullable: true })
  floor_image?: string;

  @Column({ name: 'build_id', type: 'int', nullable: false })
  build_id: number;
}
