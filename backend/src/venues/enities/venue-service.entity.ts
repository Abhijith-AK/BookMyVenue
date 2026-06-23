import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Venue } from "./venue.entity";

@Entity()
export class VenueService{
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @ManyToOne(() => Venue, {onDelete: "CASCADE"})
    @JoinColumn({name: "venueId"})
    venue!: Venue;

    @Column("uuid")
    venueId!: string;

    @Column({type: "varchar", length: 100})
    name!: string;

    @Column("decimal", {
        precision: 10,
        scale: 2,
    })
    price!: number;
}