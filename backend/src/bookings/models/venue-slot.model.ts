export interface VenueSlot {
    id: string,
    venueId: string,
    startAt: Date,
    endAt: Date,
    price: number,
    status: SlotStatus
}

export enum SlotStatus{
    HELD = 'HELD',
    BOOKED = 'BOOKED',
};