import { CreateBookingServiceDto } from "./create-service-booking.dto";
import { CreateBookingSlotDto } from "./create-slot-booking.dto";
export declare class CreateBookingDto {
    venueId: string;
    customerId: string;
    slots: CreateBookingSlotDto[];
    guestCount: number;
    services: CreateBookingServiceDto[];
}
