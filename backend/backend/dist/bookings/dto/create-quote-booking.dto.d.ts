import { CreateBookingServiceDto } from "./create-service-booking.dto";
export declare class CreateQuoteBookingDto {
    venueId: string;
    slotIds: string[];
    guestCount: number;
    services: CreateBookingServiceDto[];
}
