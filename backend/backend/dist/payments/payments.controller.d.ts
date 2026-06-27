import { PaymentsService } from './payments.service';
import { VerifyPaymentDto } from './dto/verify-payment.dto';
import { FailedPaymentDto } from './dto/fail-payment.dto';
import type { JwtUser } from "../auth/get-user.models";
export declare class PaymentsController {
    private paymentsService;
    constructor(paymentsService: PaymentsService);
    verifyPayment(verifyPaymentDto: VerifyPaymentDto): Promise<boolean>;
    failedPayment(user: JwtUser, dto: FailedPaymentDto): Promise<boolean>;
}
