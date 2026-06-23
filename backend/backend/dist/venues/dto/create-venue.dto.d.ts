import { Districts, WeekDays } from "../enums/venue.enums";
export declare class CreateVenueDto {
    name: string;
    description: string;
    address: string;
    district: Districts;
    photos: string[];
    minCapacity: number;
    maxCapacity: number;
    tags?: string[];
    availableFrom: Date;
    availableUntil: Date;
    openingTime: string;
    closingTime: string;
    holidays?: Date[];
    weekDayOff?: WeekDays[];
    slotDurationMinutes: number;
    pricePerSlot: number;
    bookingBufferMinutes: number;
    ownerId: string;
    categoryIds: string[];
    amenityIds: string[];
}
