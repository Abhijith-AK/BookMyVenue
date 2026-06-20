export interface Venue {
    id: string;
    ownerId: string;
    name: string;
    description: string;
    address: string;
    district: Districts;
    photos: string[];
    minCapacity: number;
    maxCapacity: number;
    tags: string[];
    status: VenueStatus;
    availableFrom: Date;
    availableUntil: Date;
    openingTime: string;
    closingTime: string;
    holidays: Date[];
    weekDayOff: WeekDays[];
    slotDurationMinutes: number;
    pricePerSlot: number;
    bookingBufferMinutes: number;
    createdAt: Date;
}
export declare enum VenueStatus {
    PENDING_APPROVAL = "PENDING_APPROVAL",
    APPROVED = "APPROVED",
    REJECTED = "REJECTED"
}
export declare enum WeekDays {
    MONDAY = "MONDAY",
    TUESDAY = "TUESDAY",
    WEDNESDAY = "WEDNESDAY",
    THURSDAY = "THURSDAY",
    FRIDAY = "FRIDAY",
    SATURDAY = "SATURDAY",
    SUNDAY = "SUNDAY"
}
export declare enum Districts {
    ALAPPUZHA = "Alappuzha",
    ERNAKULAM = "Ernakulam",
    IDUKKI = "Idukki",
    KANNUR = "Kannur",
    KASARAGOD = "Kasaragod",
    KOLLAM = "Kollam",
    KOTTAYAM = "Kottayam",
    KOZHIKODE = "Kozhikode",
    MALAPPURAM = "Malappuram",
    PALAKKAD = "Palakkad",
    PATHANAMTHITTA = "Pathanamthitta",
    THIRUVANANTHAPURAM = "Thiruvananthapuram",
    THRISSUR = "Thrissur",
    WAYANAD = "Wayanad"
}
