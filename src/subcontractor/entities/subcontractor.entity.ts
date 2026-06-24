import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('subcontractors')
export class Subcontractor {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', nullable: false })
  departId: number;

  @Column({ type: 'varchar', length: 255, nullable: false })
  subContractorName: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  logo?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  username?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  password?: string;

  @CreateDateColumn({ name: 'createdTime' })
  createdTime: Date;
}

