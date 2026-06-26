import { Venue } from "./venue.entity";
import { SlotStatus } from "../enums/venue.enums";
import { Booking } from "../../bookings/booking.entity";
export declare class VenueSlot {
    id: string;
    venue: Venue;
    venueId: string;
    startAt: Date;
    endAt: Date;
    price: number;
    status: SlotStatus;
    booking?: Booking;
    bookingId?: string;
}
