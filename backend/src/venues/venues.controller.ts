import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post, Query } from '@nestjs/common';
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

@Controller('venues')
export class VenuesController {
    constructor(private venueService: VenuesService){}

    @Get()
    getAllVenues(@Query() query: GetVenueFilterDto){
            return this.venueService.getFilteredVenues(query); 
    }

    @Get('/owner/:ownerId')
    getAllVenuesByOwner(@Param('ownerId', new ParseUUIDPipe()) ownerId: string){
        return this.venueService.getVenueForOwners(ownerId);
    }

    @Post()
    createVenue(@Body() createVenueDto: CreateVenueDto){
        return this.venueService.createVenue(createVenueDto);
    }

    @Get("categories")
    getAllCategories(){
        return this.venueService.getAllCategories();
    }

    @Post("categories")
    createCategory(@Body() createCategoryDto: CreateVenueCategoryDto){
        return this.venueService.createCategory(createCategoryDto);
    }

    @Patch("categories/:id")
    updateCategory(@Param('id', new ParseUUIDPipe()) id: string, @Body() updateCategoryDto: UpdateVenueCategoryDto){
        return this.venueService.updateCategory(id, updateCategoryDto);
    }

    @Delete("categories/:id")
    deleteCategory(@Param('id', new ParseUUIDPipe()) id: string){
        return this.venueService.deleteCategory(id);
    }

    @Get("amenities")
    getAllAmenities(){
        return this.venueService.getAllAmenities();
    }

    @Post("amenities")
    createAmenity(@Body() createAmenityDto: CreateVenueAmenityDto){
        return this.venueService.createAmenity(createAmenityDto);
    }

    @Patch("amenities/:id")
    updateAmenity(@Param('id', new ParseUUIDPipe()) id: string, @Body() updateAmenityDto: UpdateVenueAmenityDto){
        return this.venueService.updateAmenity(id, updateAmenityDto);
    }

    @Delete("amenities/:id")
    deleteAmenity(@Param('id', new ParseUUIDPipe()) id: string){
        return this.venueService.deleteAmenity(id);
    }

    @Get(":venueId/services")
    getAllServices(@Param('venueId', new ParseUUIDPipe()) id: string){
        return this.venueService.getAllServices(id);
    }

    @Post(":venueId/services")
    createService(@Param('venueId', new ParseUUIDPipe()) venueId: string, @Body() createServiceDto: CreateVenueServiceDto){
        createServiceDto.venueId = venueId;
        return this.venueService.createService(createServiceDto);
    }

    @Patch(":venueId/services/:id")
    updateService(@Param('id', new ParseUUIDPipe()) id: string, @Body() updateServiceDto: UpdateVenueServiceDto){
        return this.venueService.updateService(id, updateServiceDto);
    }

    @Delete(":venueId/services/:id")
    deleteService(@Param('id', new ParseUUIDPipe()) id: string){
        return this.venueService.deleteService(id);
    }

    @Get(":id")
    getVenueById(@Param('id', new ParseUUIDPipe()) id: string){
        return this.venueService.getVenueById(id);
    }

    @Patch(":id")
    updateVenue(@Param('id', new ParseUUIDPipe()) id: string, @Body() updatevenueDto: UpdateVenueDto){
        return this.venueService.updateVenue(id, updatevenueDto);
    }

    @Delete(":id")
    deleteVenue(@Param('id', new ParseUUIDPipe()) id: string){
        return this.venueService.deleteVenue(id);
    }
}