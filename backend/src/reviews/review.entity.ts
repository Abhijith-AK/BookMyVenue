import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique } from "typeorm";

@Entity()
@Unique(["bookingId"])
export class Review {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column("uuid")
    bookingId!: string;

    @Column("uuid")
    venueId!: string;

    @Column("uuid")
    customerId!: string;

    @Column("int")
    rating!: number;

    @Column("text", { nullable: true })
    comment?: string;

    @CreateDateColumn()
    createdAt!: Date;
}