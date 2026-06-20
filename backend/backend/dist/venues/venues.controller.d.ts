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
export declare class VenuesController {
    private venueService;
    constructor(venueService: VenuesService);
    getAllVenues(query: GetVenueFilterDto): import("./models/venue.model").Venue[];
    getAllVenuesByOwner(ownerId: string): import("./models/venue.model").Venue[];
    createVenue(createVenueDto: CreateVenueDto): {
        venue: import("./models/venue.model").Venue;
    };
    getAllCategories(): import("./models/venue-category.model").VenueCategory[];
    createCategory(createCategoryDto: CreateVenueCategoryDto): import("./models/venue-category.model").VenueCategory;
    updateCategory(id: string, updateCategoryDto: UpdateVenueCategoryDto): import("./models/venue-category.model").VenueCategory;
    deleteCategory(id: string): void;
    getAllAmenities(): import("./models/venue-amenity.model").VenueAmenity[];
    createAmenity(createAmenityDto: CreateVenueAmenityDto): import("./models/venue-amenity.model").VenueAmenity;
    updateAmenity(id: string, updateAmenityDto: UpdateVenueAmenityDto): import("./models/venue-amenity.model").VenueAmenity;
    deleteAmenity(id: string): void;
    getAllServices(id: string): import("./models/venue-service.model").VenueService[];
    createService(venueId: string, createServiceDto: CreateVenueServiceDto): import("./models/venue-service.model").VenueService[];
    updateService(id: string, updateServiceDto: UpdateVenueServiceDto): import("./models/venue-service.model").VenueService;
    deleteService(id: string): void;
    getVenueById(id: string): import("./models/venue.model").Venue;
    updateVenue(id: string, updatevenueDto: UpdateVenueDto): import("./models/venue.model").Venue;
    deleteVenue(id: string): void;
}
