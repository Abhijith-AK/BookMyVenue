import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique } from "typeorm";
import { Venue } from "./venue.entity";
import { SlotStatus } from "../enums/venue.enums";

@Entity()
@Unique(["venueId", "startAt"])
export class VenueSlot{
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @ManyToOne(() => Venue, {onDelete: "CASCADE"})
    @JoinColumn({name: "venueId"})
    venue!: Venue;

    @Index()
    @Column("uuid")
    venueId!: string;
    
    @Column("timestamp")
    startAt!: Date;

    @Column("timestamp")
    endAt!: Date;

    @Column("decimal", {
        precision: 10,
        scale: 2
    })
    price!: number;

    @Index()
    @Column({
        type: "enum",
        enum: SlotStatus
    })
    status!: SlotStatus
}