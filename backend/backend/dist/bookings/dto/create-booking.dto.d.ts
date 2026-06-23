import { CreateBookingServiceDto } from "./create-service-booking.dto";
export declare class CreateBookingDto {
    venueId: string;
    customerId: string;
    slotIds: string[];
    guestCount: number;
    services: CreateBookingServiceDto[];
}
