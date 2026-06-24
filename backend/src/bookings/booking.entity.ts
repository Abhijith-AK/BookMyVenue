import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { BookingStatus } from "./enums/booking.enums";
import { Venue } from "src/venues/enities/venue.entity";
import { VenueSlot } from "src/venues/enities/venue-slot.entity";

@Entity()
export class Booking{
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @ManyToOne(() => Venue)
    @JoinColumn({name: "venueId"})
    venue!: Venue;

    @Column("uuid")
    venueId!: string;

    @Column("uuid")
    customerId!: string;

    @OneToMany(() => VenueSlot, slot => slot.booking)
    slots!: VenueSlot[];

    @Column({type: "enum", enum: BookingStatus})
    status!: BookingStatus; 

    @Column("decimal", {precision: 10, scale: 2})
    totalAmount!: number;

    @Column("decimal", {precision: 10, scale: 2})
    slotsAmount!: number;

    @Column("decimal", {precision: 10, scale: 2})
    servicesAmount!: number;

    @Column("int")
    guestCount!: number;

    @CreateDateColumn()
    createdAt!: Date;
}