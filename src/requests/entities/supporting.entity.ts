import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('rams_file')
export class RamsFile {
  @PrimaryGeneratedColumn({ name: 'rams_file_id' })
  ramsFileId: number;

  @Column({ name: 'request_id', type: 'int' })
  requestId: number;

  @Column({ name: 'rams_file', type: 'varchar', length: 200 })
  ramsFile: string;

  @Column({ name: 'status', type: 'tinyint', default: 1 })
  status: number;

  @Column({ name: 'created_at', type: 'datetime' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;

  @Column({ name: 'userId', type: 'int' })
  userId: number;
}

@Entity('notes')
export class RequestNote {
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  @Column({ name: 'request_id', type: 'int' })
  requestId: number;

  @Column({ name: 'permit_no', type: 'varchar', length: 200 })
  permitNo: string;

  @Column({ name: 'user_id', type: 'int' })
  userId: number;

  @Column({ name: 'username', type: 'varchar', length: 200 })
  username: string;

  @Column({ name: 'note', type: 'text' })
  note: string;

  @Column({ name: 'createdTime', type: 'datetime' })
  createdTime: Date;
}

@Entity('uploadimage')
export class UploadImage {
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  @Column({ name: 'requestId', type: 'int' })
  requestId: number;

  @Column({ name: 'imageName', type: 'varchar', length: 200 })
  imageName: string;

  @Column({ name: 'userId', type: 'int' })
  userId: number;
}

@Entity('logs')
export class RequestLog {
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  @Column({ name: 'requestId', type: 'int' })
  requestId: number;

  @Column({ name: 'requestType', type: 'varchar', length: 50, nullable: true })
  requestType?: string; // stores request status

  @Column({ name: 'userId', type: 'int', nullable: true })
  userId?: number;

  @Column({ name: 'createdTime', type: 'datetime', nullable: true })
  createdTime?: Date;

  @Column({ name: 'permitno', type: 'varchar', length: 200, nullable: true })
  permitNo?: string;

  @Column({ name: 'system', type: 'int', default: 0 })
  system: number;
}

@Entity('logsdata')
export class RequestLogData {
  @PrimaryGeneratedColumn({ name: 'logs_data_id' })
  logsDataId: number;

  @Column({ name: 'log_id', type: 'int' })
  logId: number;

  @Column({ name: 'field_name', type: 'varchar', length: 400 })
  fieldName: string;

  @Column({ name: 'previous', type: 'varchar', length: 300 })
  previous: string;

  @Column({ name: 'present', type: 'varchar', length: 300 })
  present: string;

  @Column({ name: 'createdTime', type: 'datetime' })
  createdTime: Date;
}

@Entity('complete_logs')
export class CompleteLog {
  @PrimaryGeneratedColumn({ name: 'complete_log_id' })
  completeLogId: number;

  @Column({ name: 'id', type: 'int' })
  id: number;

  @Column({ name: 'PermitNo', type: 'varchar', length: 200 })
  permitNo: string;

  @Column({ name: 'status', type: 'varchar', length: 200 })
  status: string;

  @Column({ name: 'module', type: 'varchar', length: 200 })
  module: string;

  @CreateDateColumn({ name: 'createdTime' })
  createdTime: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;
}

