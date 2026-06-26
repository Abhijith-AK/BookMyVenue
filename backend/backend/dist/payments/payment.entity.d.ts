import { Booking } from "../bookings/booking.entity";
import { PaymentStatus } from "./enums/payment.enum";
export declare class Payment {
    id: string;
    bookingId: string;
    booking: Booking;
    razorpayOrderId: string;
    razorpayPaymentId?: string;
    razorpayRefundId?: string;
    amount: number;
    refundedAmount: number;
    status: PaymentStatus;
    createdAt: Date;
    updatedAt: Date;
}
