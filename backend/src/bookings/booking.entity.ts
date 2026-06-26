import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { BookingStatus } from "./enums/booking.enums";
import { Venue } from "src/venues/enities/venue.entity";
import { VenueSlot } from "src/venues/enities/venue-slot.entity";
import { Payment } from "src/payments/payment.entity";

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

    @OneToMany(() => Payment, payment => payment.booking)
    payments!: Payment[];

    @Column({nullable: true})
    cancellationReason?: string

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;
}