import { Districts, VenueStatus, WeekDays } from "../enums/venue.enums";
export declare class UpdateVenueDto {
    name?: string;
    description?: string;
    address?: string;
    district?: Districts;
    minCapacity?: number;
    status?: VenueStatus;
    maxCapacity?: number;
    tags?: string[];
    availableFrom?: Date;
    availableUntil?: Date;
    openingTime?: string;
    closingTime?: string;
    holidays?: Date[];
    weekDayOff?: WeekDays[];
    slotDurationMinutes?: number;
    pricePerSlot?: number;
    bookingBufferMinutes?: number;
    categoryIds: string[];
    amenityIds: string[];
}
