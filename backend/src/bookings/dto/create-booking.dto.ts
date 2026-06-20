import { ArrayNotEmpty, IsArray, IsNotEmpty, IsNumber, IsUUID, Min, ValidateNested } from "class-validator";
import { Type } from "class-transformer";
import { CreateBookingServiceDto } from "./create-service-booking.dto";

export class CreateBookingDto{
        @IsNotEmpty()
        @IsUUID('4')
        venueId!: string;

        @IsNotEmpty()
        @IsUUID()
        customerId!: string;

        @IsNotEmpty()
        @IsArray()
        @ArrayNotEmpty()
        @IsUUID('4', {each: true})
        slotIds!: string[];

        @IsNotEmpty()
        @Type(() => Number)
        @IsNumber()
        @Min(1)
        guestCount!: number;

        @ValidateNested({each: true})
        @Type(() => CreateBookingServiceDto)
        services!: CreateBookingServiceDto[];
}