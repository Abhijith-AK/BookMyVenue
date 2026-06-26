import { Payment } from './payment.entity';
import { DataSource, Repository } from 'typeorm';
import { VerifyPaymentDto } from './dto/verify-payment.dto';
import { BookingsService } from "../bookings/bookings.service";
export declare class PaymentsService {
    private dataSource;
    private paymentRepository;
    private bookingService;
    private razorpay;
    constructor(dataSource: DataSource, paymentRepository: Repository<Payment>, bookingService: BookingsService);
    createOrder(amount: number, receipt: string): Promise<import("razorpay/dist/types/orders").Orders.RazorpayOrder>;
    createPaymentRecord(bookingId: string, razorpayOrderId: string, amount: number): Promise<Payment>;
    verifyPayment(verifyPaymentDto: VerifyPaymentDto): Promise<boolean>;
    failedPayment(orderId: string): Promise<boolean>;
    refundPayment(bookingId: string, refundAmount: number, reason?: string): Promise<import("razorpay/dist/types/refunds").Refunds.RazorpayRefund>;
}
