export interface BookingService {
    id: string;
    bookingId: string;
    serviceId: string;
    quantity: number;
    unitPrice: number;
    priceType: PriceType;
}

export enum PriceType {
    FIXED = "FIXED",
    PER_UNIT = "PER_UNIT"
}