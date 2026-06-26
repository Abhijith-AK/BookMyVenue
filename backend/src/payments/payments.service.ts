import { BadRequestException, ConflictException, forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import Razorpay from 'razorpay';
import { Payment } from './payment.entity';
import { DataSource, Repository } from 'typeorm';
import { PaymentStatus } from './enums/payment.enum';
import { VerifyPaymentDto } from './dto/verify-payment.dto';
import * as crypto from "crypto";
import { BookingsService } from 'src/bookings/bookings.service';

@Injectable()
export class PaymentsService {
    private razorpay!: Razorpay;
    
    constructor(        
        @InjectDataSource()
        private dataSource: DataSource,
        @InjectRepository(Payment)
        private paymentRepository: Repository<Payment>,
        @Inject(forwardRef(() => BookingsService))
        private bookingService: BookingsService        
    ){
        this.razorpay = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID!,
            key_secret: process.env.RAZORPAY_KEY_SECRET!,
        });
    }
    // create payment order
    async createOrder(amount: number, receipt: string){
        return await this.razorpay.orders.create({
            amount: Math.round(amount * 100),
            currency: "INR",
            receipt,
        })
    }
    
    async createPaymentRecord(bookingId: string, razorpayOrderId: string, amount: number): Promise<Payment>{
       const paymentRecord: Payment = this.paymentRepository.create({
            bookingId,
            razorpayOrderId,
            amount,
            status: PaymentStatus.PENDING
       })
      await this.paymentRepository.save(paymentRecord);
      return paymentRecord;
    }
    // verify payment
    async verifyPayment(verifyPaymentDto: VerifyPaymentDto): Promise<boolean> {
        
        const {razorpay_order_id, razorpay_payment_id, razorpay_signature} = verifyPaymentDto;

        const paymentRecord = await this.paymentRepository.findOne({where: {razorpayOrderId: razorpay_order_id}});
        if(!paymentRecord)  throw new BadRequestException(`Invalid OrderID ${razorpay_order_id}`);

        if (paymentRecord.status === PaymentStatus.PAID) {
            return true;
        }

        if(paymentRecord.status === PaymentStatus.FAILED){
            throw new BadRequestException("Payment already failed");
        }

        const expectedSignature = crypto
            .createHmac(
                "sha256",
                process.env.RAZORPAY_KEY_SECRET!
            )
            .update(`${razorpay_order_id}|${razorpay_payment_id}`)
            .digest("hex");
        
        if(expectedSignature !== razorpay_signature) {
            await this.dataSource.transaction(async (manager) => {
                const paymentRepository = manager.getRepository(Payment);
                
                paymentRecord.razorpayPaymentId = razorpay_payment_id;
                paymentRecord.status = PaymentStatus.FAILED;

                await this.bookingService.failedBooking(paymentRecord.bookingId, manager);
                await paymentRepository.save(paymentRecord);
            })
            throw new BadRequestException("Invalid Payment Signature");
        }
        
        
        await this.dataSource.transaction(async (manager) => {
            const paymentRepository = manager.getRepository(Payment);
            
            paymentRecord.razorpayPaymentId = razorpay_payment_id;
            paymentRecord.status = PaymentStatus.PAID;

            await this.bookingService.confirmedBooking(paymentRecord.bookingId, manager);
            await paymentRepository.save(paymentRecord);
        })
        
        return true;
    }
    // payment fail
    async failedPayment(orderId: string){
        const paymentRecord = await this.paymentRepository.findOne({where: {razorpayOrderId: orderId}});
        if(!paymentRecord) throw new BadRequestException(`Invalid Order ${orderId}`)

        if (paymentRecord.status === PaymentStatus.FAILED)
            return true;

        if (paymentRecord.status === PaymentStatus.PAID)
            throw new BadRequestException("Payment already completed");

        await this.dataSource.transaction(async (manager) => {
            const paymentRepository = manager.getRepository(Payment);
                
            paymentRecord.status = PaymentStatus.FAILED;

            await this.bookingService.failedBooking(paymentRecord.bookingId, manager);
            await paymentRepository.save(paymentRecord);
        })
        return true;
    }

    async refundPayment(bookingId: string, refundAmount: number, reason?: string){
        const payment = await this.paymentRepository.findOne({where: {bookingId, status: PaymentStatus.PAID}});
        if(!payment) throw new NotFoundException("Payment not found!");
        const refund = await this.razorpay.payments.refund(payment.razorpayPaymentId!, { amount: Math.round(refundAmount * 100) });
        if(refund.status === "processed" || refund.status === "pending"){
            await this.dataSource.transaction(async (manager) => {
                const paymentRepository = manager.getRepository(Payment);

                payment.razorpayRefundId = refund.id;
                payment.refundedAmount = refundAmount;
                payment.status = PaymentStatus.REFUNDED;

                await this.bookingService.updateCancelledBooking(payment.bookingId, manager, reason);
                await paymentRepository.save(payment);
            })
        }else{
            throw new ConflictException(`Refund process failed, Try again later.`)
        }

        return refund;
    }
}
