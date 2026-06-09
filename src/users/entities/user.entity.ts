import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users')
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: true, unique: true })
    username: string;

    @Column({ nullable: true })
    password: string;

    @Column({ nullable: true })
    userType: string;

    @Column({ nullable: true })
    typeId: number;

    @Column({ nullable: true })
    empId: number;

    @Column({ nullable: true })
    auth_token: string;

    @Column({ nullable: true, type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    created: Date;

    @Column({ nullable: true })
    otp: string;

    // @Column({ nullable: true })
    // phonenumber: string;

    // @Column({ nullable: true })
    // otp_created_at: Date;
}