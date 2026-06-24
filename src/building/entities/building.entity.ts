import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('buildings')
export class Building {
  @PrimaryGeneratedColumn({ name: 'build_id' })
  build_id: number;

  @Column({ name: 'building_name', type: 'varchar', length: 255, nullable: false })
  building_name: string;

  @Column({ name: 'description', type: 'text', nullable: true })
  description?: string;

  @Column({ name: 'building_status', type: 'varchar', length: 255, nullable: false, default: 'Active' })
  building_status: string;

  @Column({ name: 'menu_status', type: 'varchar', length: 255, nullable: false, default: 'Yes' })
  menu_status: string;

  @Column({ name: 'building_image', type: 'varchar', length: 500, nullable: true })
  building_image?: string;

  @Column({ name: 'site_id', type: 'int', nullable: false })
  site_id: number;
}
