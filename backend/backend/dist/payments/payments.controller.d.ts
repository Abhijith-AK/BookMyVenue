import { PaymentsService } from './payments.service';
import { VerifyPaymentDto } from './dto/verify-payment.dto';
import { FailedPaymentDto } from './dto/fail-payment.dto';
export declare class PaymentsController {
    private paymentsService;
    constructor(paymentsService: PaymentsService);
    verifyPayment(verifyPaymentDto: VerifyPaymentDto): Promise<boolean>;
    failedPayment(dto: FailedPaymentDto): Promise<boolean>;
}
