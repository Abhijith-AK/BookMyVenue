import { IsNotEmpty, IsNumber, IsUUID, Min } from "class-validator";
import { Type } from "class-transformer";

export class CreateBookingServiceDto {
        @IsNotEmpty()
        @IsUUID('4')
        serviceId!: string;

        @IsNotEmpty()
        @Type(() => Number)
        @IsNumber()
        @Min(1)
        quantity!: number;
}