import { Districts } from "../models/venue.model";
export declare class GetVenueFilterDto {
    search?: string;
    district?: Districts;
    category?: string;
    price?: number;
    capacity?: number;
    date?: Date;
}
