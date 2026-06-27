import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { VerifyPaymentDto } from './dto/verify-payment.dto';
import { FailedPaymentDto } from './dto/fail-payment.dto';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { UserRole } from 'src/users/user.enums';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import type { JwtUser } from 'src/auth/get-user.models';

@Controller('payments')
export class PaymentsController {
    constructor(private paymentsService: PaymentsService){};
    // payment verify
    @UseGuards(RolesGuard)
    @Roles(UserRole.CUSTOMER)
    @Post('verify')
    async verifyPayment(@Body() verifyPaymentDto: VerifyPaymentDto): Promise<boolean> {
        return this.paymentsService.verifyPayment(verifyPaymentDto);
    };
    // payment fail
    @UseGuards(RolesGuard)
    @Roles(UserRole.CUSTOMER)
    @Post('fail')
    async failedPayment(@GetUser() user: JwtUser, @Body() dto: FailedPaymentDto): Promise<boolean>{
        return this.paymentsService.failedPayment(dto.razorpay_order_id, user);
    };
}
