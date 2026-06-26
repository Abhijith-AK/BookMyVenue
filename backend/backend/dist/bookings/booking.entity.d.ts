import { BookingStatus } from "./enums/booking.enums";
import { Venue } from "../venues/enities/venue.entity";
import { VenueSlot } from "../venues/enities/venue-slot.entity";
import { Payment } from "../payments/payment.entity";
export declare class Booking {
    id: string;
    venue: Venue;
    venueId: string;
    customerId: string;
    slots: VenueSlot[];
    status: BookingStatus;
    totalAmount: number;
    slotsAmount: number;
    servicesAmount: number;
    guestCount: number;
    payments: Payment[];
    cancellationReason?: string;
    createdAt: Date;
    updatedAt: Date;
}
