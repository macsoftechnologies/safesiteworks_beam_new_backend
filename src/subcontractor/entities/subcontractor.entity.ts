import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

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
}

