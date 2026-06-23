import { VenuesService } from './venues.service';
import { GetVenueFilterDto } from './dto/get-venue-filter.dto';
import { CreateVenueCategoryDto } from './dto/create-category-venue.dto';
import { UpdateVenueCategoryDto } from './dto/update-category-venue.dto';
import { CreateVenueAmenityDto } from './dto/create-amenity-venue.dto';
import { UpdateVenueAmenityDto } from './dto/update-amenity-venue.dto';
import { CreateVenueServiceDto } from './dto/create-service-venue.dto';
import { UpdateVenueServiceDto } from './dto/update-service-venue.dto';
import { CreateVenueDto } from './dto/create-venue.dto';
import { UpdateVenueDto } from './dto/update-venue.dto';
import { GetVenueByIdDto } from './dto/get-venue-id.dto';
export declare class VenuesController {
    private venueService;
    constructor(venueService: VenuesService);
    getAllVenues(query: GetVenueFilterDto): Promise<import("./enities/venue.entity").Venue[]>;
    getAllVenuesByOwner(ownerId: string): Promise<import("./enities/venue.entity").Venue[]>;
    createVenue(createVenueDto: CreateVenueDto): Promise<import("./enities/venue.entity").Venue>;
    getAllCategories(): Promise<import("./enities/venue-category.entity").VenueCategory[]>;
    createCategory(createCategoryDto: CreateVenueCategoryDto): Promise<import("./enities/venue-category.entity").VenueCategory>;
    updateCategory(id: string, updateCategoryDto: UpdateVenueCategoryDto): Promise<import("./enities/venue-category.entity").VenueCategory>;
    deleteCategory(id: string): Promise<void>;
    getAllAmenities(): Promise<import("./enities/venue-amenity.entity").VenueAmenity[]>;
    createAmenity(createAmenityDto: CreateVenueAmenityDto): Promise<import("./enities/venue-amenity.entity").VenueAmenity>;
    updateAmenity(id: string, updateAmenityDto: UpdateVenueAmenityDto): Promise<import("./enities/venue-amenity.entity").VenueAmenity>;
    deleteAmenity(id: string): Promise<void>;
    getAllServices(id: string): Promise<import("./enities/venue-service.entity").VenueService[]>;
    createService(venueId: string, createServiceDto: CreateVenueServiceDto): Promise<import("./enities/venue-service.entity").VenueService>;
    updateService(id: string, updateServiceDto: UpdateVenueServiceDto): Promise<import("./enities/venue-service.entity").VenueService>;
    deleteService(id: string): Promise<void>;
    getVenueById(id: string, query: GetVenueByIdDto): Promise<{
        venue: import("./enities/venue.entity").Venue;
        slots: import("./enities/venue-slot.entity").VenueSlot[];
        services: import("./enities/venue-service.entity").VenueService[];
    }>;
    updateVenue(id: string, updatevenueDto: UpdateVenueDto): Promise<import("./enities/venue.entity").Venue>;
    deleteVenue(id: string): Promise<void>;
}
