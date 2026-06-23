import { Districts } from "../enums/venue.enums";
export declare class GetVenueFilterDto {
    search?: string;
    district?: Districts;
    category?: string;
    price?: number;
    capacity?: number;
    date?: Date;
}
