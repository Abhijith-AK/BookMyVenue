import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn } from "typeorm";
import { UserRole, UserStatus } from "./user.enums";

@Entity()
export class User{
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column({type: "varchar", length: 100})
    name!: string;

    @Index()
    @Column({  
        type: "varchar",
        length: 255,
        unique: true,
    })
    email!: string;

    @Index()
    @Column({
        type: "varchar",
        length: 15,
        unique: true
    })
    phoneNo!: string;

    @Column({
        type: "varchar",
        length: 255,
        select: false
    })
    password!: string;

    @Column({type: "enum", enum: UserRole})
    role!: UserRole;

    @Column({type: "enum", enum: UserStatus})
    status!: UserStatus;

    @CreateDateColumn()
    createdAt!: Date;    
}