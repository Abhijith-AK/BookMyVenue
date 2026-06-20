import { IsNotEmpty, IsOptional, IsString, IsUUID, MaxLength } from "class-validator";

export class CancelBookingDto{
    @IsNotEmpty()
    @IsUUID('4')
    bookingId!: string;

    @IsOptional()
    @IsString()
    @MaxLength(500)
    reason?: string;
}