import { CreateBookingServiceDto } from "./create-service-booking.dto";
import { CreateBookingSlotDto } from "./create-slot-booking.dto";
export declare class CreateQuoteBookingDto {
    venueId: string;
    slots: CreateBookingSlotDto[];
    guestCount: number;
    services: CreateBookingServiceDto[];
}
