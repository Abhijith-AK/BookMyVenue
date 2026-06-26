import { Booking } from "src/bookings/booking.entity";
import { Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { PaymentStatus } from "./enums/payment.enum";

@Entity()
export class Payment {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Index()
    @Column("uuid")
    bookingId!: string;

    @ManyToOne(() => Booking)
    @JoinColumn({ name: "bookingId" })
    booking!: Booking;
 
    @Index()
    @Column({unique: true})
    razorpayOrderId!: string;

    @Index()
    @Column({ nullable: true })
    razorpayPaymentId?: string;

    @Column({ nullable: true })
    razorpayRefundId?: string;

    @Column("decimal", {
        precision: 10,
        scale: 2
    })
    amount!: number;

    @Column("decimal", {
        precision: 10,
        scale: 2,
        default: 0
    })
    refundedAmount!: number;

    @Column({
        type: "enum",
        enum: PaymentStatus
    })
    status!: PaymentStatus;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;
}
