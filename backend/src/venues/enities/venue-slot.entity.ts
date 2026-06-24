import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique } from "typeorm";
import { Venue } from "./venue.entity";
import { SlotStatus } from "../enums/venue.enums";
import { Booking } from "src/bookings/booking.entity";

@Entity()
@Unique("UQ_VENUE_SLOT_START", ["venueId", "startAt"])
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
    status!: SlotStatus;

    @ManyToOne(() => Booking, booking => booking.slots, {nullable: true})
    @JoinColumn({name: "bookingId"})
    booking?: Booking

    @Column("uuid", {nullable: true})
    bookingId?: string;
}