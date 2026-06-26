import { IsNotEmpty, IsString } from "class-validator";

export class FailedPaymentDto {
    @IsString()
    @IsNotEmpty()
    razorpay_order_id!: string;
}