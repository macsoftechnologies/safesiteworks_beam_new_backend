import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('users')
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: true, unique: true })
    username: string;

    @Column({ nullable: true })
    password: string;

    @Column({ nullable: false })
    userType: string;

    @Column({ nullable: false })
    typeId: number;

    @Column({ nullable: true })
    empId: number;

    @Column({ nullable: true })
    auth_token: string;

    @CreateDateColumn({ name: 'created' })
    created: Date;

    @Column({ nullable: true })
    otp: string;

    // @Column({ nullable: true })
    // phonenumber: string;

    // @Column({ nullable: true })
    // otp_created_at: Date;
}