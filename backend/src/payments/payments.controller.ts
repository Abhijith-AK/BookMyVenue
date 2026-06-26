import { Body, Controller, Param, ParseUUIDPipe, Post } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { VerifyPaymentDto } from './dto/verify-payment.dto';
import { FailedPaymentDto } from './dto/fail-payment.dto';

@Controller('payments')
export class PaymentsController {
    constructor(private paymentsService: PaymentsService){};
    // payment verify
    @Post('verify')
    async verifyPayment(@Body() verifyPaymentDto: VerifyPaymentDto): Promise<boolean> {
        return this.paymentsService.verifyPayment(verifyPaymentDto);
    };
    // payment fail
    @Post('fail')
    async failedPayment(@Body() dto: FailedPaymentDto): Promise<boolean>{
        return this.paymentsService.failedPayment(dto.razorpay_order_id);
    };
}
