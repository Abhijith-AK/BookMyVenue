import { ArrayNotEmpty, IsArray, IsNotEmpty, IsNumber, IsUUID, Min, ValidateNested } from "class-validator";
import { Type } from "class-transformer";
import { CreateBookingServiceDto } from "./create-service-booking.dto";
import { CreateBookingSlotDto } from "./create-slot-booking.dto";

export class CreateBookingDto{
        @IsNotEmpty()
        @IsUUID('4')
        venueId!: string;

        @IsArray()
        @ArrayNotEmpty()
        @IsNotEmpty()
        @ValidateNested({each: true})
        @Type(() => CreateBookingSlotDto)
        slots!: CreateBookingSlotDto[];

        @IsNotEmpty()
        @Type(() => Number)
        @IsNumber()
        @Min(1)
        guestCount!: number;

        @ValidateNested({each: true})
        @Type(() => CreateBookingServiceDto)
        services!: CreateBookingServiceDto[];
}