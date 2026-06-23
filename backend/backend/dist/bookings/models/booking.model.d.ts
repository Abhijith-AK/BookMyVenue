export interface Booking {
    id: string;
    venueId: string;
    customerId: string;
    slotIds: string[];
    status: BookingStatus;
    totalAmount: number;
    guestCount: number;
    createdAt: Date;
}
export declare enum BookingStatus {
    PENDING = "PENDING",
    CONFIRMED = "CONFIRMED",
    CANCELLED = "CANCELLED"
}
