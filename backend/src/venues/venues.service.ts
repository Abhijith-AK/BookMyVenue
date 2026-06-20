import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { Venue, VenueStatus, WeekDays } from './models/venue.model';
import { GetVenueFilterDto } from './dto/get-venue-filter.dto';
import { VenueCategory } from './models/venue-category.model';
import { VenueAmenity } from './models/venue-amenity.model';
import { VenueService } from './models/venue-service.model';
import { CreateVenueServiceDto } from './dto/create-service-venue.dto';
import { randomUUID } from 'crypto';
import { UpdateVenueServiceDto } from './dto/update-service-venue.dto';
import { CreateVenueDto } from './dto/create-venue.dto';
import { UpdateVenueDto } from './dto/update-venue.dto';
import { VenueCategoryMapping } from './models/venue-category-mapping.model';
import { VenueAmenityMapping } from './models/venue-amenity-mapping.model';
import { UpdateVenueCategoryDto } from './dto/update-category-venue.dto';
import { CreateVenueCategoryDto } from './dto/create-category-venue.dto';
import { CreateVenueAmenityDto } from './dto/create-amenity-venue.dto';
import { UpdateVenueAmenityDto } from './dto/update-amenity-venue.dto';

@Injectable()
export class VenuesService {
    private venues: Venue[] = [];
    private categories: VenueCategory[] = [];
    private amenities: VenueAmenity[] = [];
    private services: VenueService[] = [];
    private venueCategoryMappings: VenueCategoryMapping[] = [];
    private venueAmenityMappings: VenueAmenityMapping[] = [];

    private toMinutes(time: string): number {
        const [h, m] = time.split(":").map(Number);
        return h * 60 + m;
    }

    // -------PUBLIC---------
    getAllVenues(){
        return this.venues.filter((venue) => venue.status === VenueStatus.APPROVED)
    }
    // filter venues
    getFilteredVenues(query: GetVenueFilterDto){
        let filteredVenues: Venue[] = this.venues.filter((venue) => venue.status === VenueStatus.APPROVED);
        if(query.search)
            filteredVenues = filteredVenues.filter((venue) => venue.name.toLowerCase().includes(query.search!.toLowerCase()))
        if(query.district)
            filteredVenues = filteredVenues.filter((venue) => venue.district === query.district);
        if(query.capacity !== undefined)
            filteredVenues = filteredVenues.filter((venue) => venue.maxCapacity >= query.capacity!);
        if(query.price !== undefined)
            filteredVenues = filteredVenues.filter((venue) => venue.pricePerSlot <= query.price!);
        if(query.date)
            filteredVenues = filteredVenues.filter((venue) => {
                const weekDays = [
                    WeekDays.SUNDAY,
                    WeekDays.MONDAY,
                    WeekDays.TUESDAY,
                    WeekDays.WEDNESDAY,
                    WeekDays.THURSDAY,
                    WeekDays.FRIDAY,
                    WeekDays.SATURDAY,
                ];
                const weekDay = weekDays[query.date!.getDay()];
                if(venue.weekDayOff.includes(weekDay))
                    return false;
                const isHoliday = venue.holidays.some(holiday => holiday.toDateString() === query.date!.toDateString());
                if(isHoliday)
                    return false;
                return venue.availableFrom <= query.date! && query.date! <= venue.availableUntil
            });
        if(query.category)
            filteredVenues = filteredVenues.filter((venue) => this.venueCategoryMappings.some(m => m.categoryId === query.category && m.venueId === venue.id));
        return filteredVenues;
    }
    // list a venue
    getVenueById(id: string){
        const venue = this.venues.find((venue) => venue.id === id);
        if(!venue) throw new NotFoundException(`the venue with id ${id} not found!`);
        return venue
    }

    // -------OWNER-----------
    // list venues by owner
    getVenueForOwners(ownerId: string){
        return this.venues.filter((venue) => venue.ownerId === ownerId);
    }
    // list categorys
    getAllCategories(){
        return this.categories;
    }
    getCategoryById(id:string){
        const category = this.categories.find((category) => category.id === id);
        if(!category) throw new NotFoundException(`category ${id} not found`);
        return category;
    }
    // list amenities 
    getAllAmenities(){
        return this.amenities;
    }
    getAmenityById(id: string){
        const amenity = this.amenities.find((amenity) => amenity.id === id);
        if(!amenity) throw new NotFoundException(`Amenity ${id} not found`);
        return amenity;
    }
    // list services by venue
    getAllServices(venueId: string){
        return this.services.filter((venue) => venue.venueId === venueId);
    }
    // create service
    createService(serviceDto: CreateVenueServiceDto){
        this.getVenueById(serviceDto.venueId);
        const service: VenueService = {
            id: randomUUID(),
            ...serviceDto
        };
        this.services.push(service);
        return this.services;
    }
    // update service
    updateService(id: string, updateServiceDto: UpdateVenueServiceDto){
        const {name, price} = updateServiceDto
        const service = this.services.find((service) => service.id === id);
        if(!service) throw new NotFoundException(`service with ${id} not found.`);
        if(name) service.name = name;
        if(price !== undefined) service.price = price;
        return service;
    }
    // delete service
    deleteService(id: string){
        const service = this.services.find((service) => service.id === id);
        if(!service) throw new NotFoundException(`Service ${service} not found`)
        this.services = this.services.filter((service) => service.id !== id);
    }
    // create venue
    createVenue(createVenueDto: CreateVenueDto){
        const {categoryIds, amenityIds, ...venueData} = createVenueDto;
        const {maxCapacity, minCapacity, availableFrom, availableUntil, openingTime, closingTime, tags, holidays, weekDayOff} = venueData;
        if(maxCapacity < minCapacity || availableFrom > availableUntil || this.toMinutes(openingTime) > this.toMinutes(closingTime)) 
            throw new BadRequestException("Invalid venue details");
        categoryIds.forEach((categoryId) => {
            const category = this.categories.find((category) => category.id === categoryId);
            if(!category || !category.isActive) throw new BadRequestException(`Invalid Category ${categoryId}`);
        });
        amenityIds.forEach((amenityId) => {
            const amenity = this.amenities.find((amenity) => amenity.id === amenityId);
            if(!amenity || !amenity.isActive) throw new BadRequestException(`Invalid Amenity ${amenityId}`);
        });

        const venue: Venue = {
            id: randomUUID(),
            ...venueData,
            weekDayOff: weekDayOff ? weekDayOff : [],
            holidays: holidays ? holidays : [],
            tags: tags ? tags : [],
            status: VenueStatus.PENDING_APPROVAL,
            createdAt: new Date()
        }    
        this.venues.push(venue);

        categoryIds.forEach((categoryId) => this.venueCategoryMappings.push({
            venueId: venue.id,
            categoryId,
        }));    

        amenityIds.forEach((amenityId) => this.venueAmenityMappings.push({
            venueId: venue.id,
            amenityId,
        }));

        return {
            venue,
            
        };
    }
    // update venue
    updateVenue(id: string, updateVenueDto: UpdateVenueDto){
        const { 
            address,
            availableFrom, 
            availableUntil, 
            bookingBufferMinutes, 
            closingTime, 
            description, 
            district,
            holidays,
            maxCapacity,
            minCapacity,
            name,
            openingTime,
            photos,
            pricePerSlot,
            slotDurationMinutes,
            tags,
            weekDayOff,
            amenityIds,
            categoryIds } = updateVenueDto;
        const venue = this.venues.find((venue) => venue.id === id);
        if(!venue) throw new NotFoundException(`service with ${id} not found.`);
        // if(venue.ownerId !== ownerId) throw new ForbiddenException();

        const finalAvailableFrom = availableFrom ?? venue.availableFrom;
        const finalAvailableUntil = availableUntil ?? venue.availableUntil;
        const finalMaxCapacity = maxCapacity ?? venue.maxCapacity;
        const finalMinCapacity = minCapacity ?? venue.minCapacity;
        const finalOpeningTime = openingTime ?? venue.openingTime;
        const finalClosingTime = closingTime ?? venue.closingTime;

        if(address) venue.address = address;
        if(availableFrom){ 
            if(availableFrom < finalAvailableUntil)
                venue.availableFrom = availableFrom;
            else 
                throw new BadRequestException("Invalid venue details - availableFrom");
        };
        if(availableUntil) {
            if(finalAvailableFrom < availableUntil)
                venue.availableUntil = availableUntil;
            else
                throw new BadRequestException("Invalid venue details - availableUntil");
        };
        if(bookingBufferMinutes !== undefined) venue.bookingBufferMinutes = bookingBufferMinutes;
        if(closingTime) {
            if(this.toMinutes(closingTime) > this.toMinutes(finalOpeningTime))
                venue.closingTime = closingTime;
            else
                throw new BadRequestException("Invalid venue details - closingTime");
        };
        if(description) venue.description = description;
        if(district) venue.district = district;
        if(holidays) venue.holidays = holidays;
        if(maxCapacity !== undefined) {
            if(maxCapacity > finalMinCapacity)
                venue.maxCapacity = maxCapacity;
            else
                throw new BadRequestException("Invalid venue details - maxCapacity");
        };
        if(minCapacity !== undefined) {
            if(finalMaxCapacity > minCapacity)
                venue.minCapacity = minCapacity;
            else
                throw new BadRequestException("Invalid venue details - minCapacity");
        };
        if(name) venue.name = name;
        if(openingTime) {
            if(this.toMinutes(finalClosingTime) > this.toMinutes(openingTime))
                venue.openingTime = openingTime;
            else
                throw new BadRequestException("Invalid venue details - openingTime");
        };
        if(photos) venue.photos = photos;
        if(pricePerSlot !== undefined) venue.pricePerSlot = pricePerSlot;
        if(slotDurationMinutes !== undefined) venue.slotDurationMinutes = slotDurationMinutes;
        if(tags) venue.tags = tags;
        if(weekDayOff) venue.weekDayOff = weekDayOff;
        if(categoryIds) {
            categoryIds.forEach((categoryId) => {
                const category = this.categories.find((category) => category.id === categoryId);
                if(!category || !category.isActive) throw new BadRequestException(`Invalid Category ${categoryId}`);
            });
            this.venueCategoryMappings = this.venueCategoryMappings.filter(m => m.venueId !== venue.id);
            categoryIds.forEach((categoryId) => {
                this.venueCategoryMappings.push({
                venueId: venue.id,
                categoryId
            });
        })}
        if(amenityIds) {
            amenityIds.forEach((amenityId) => {
                const amenity = this.amenities.find((amenity) => amenity.id === amenityId);
                if(!amenity || !amenity.isActive) throw new BadRequestException(`Invalid Amenity ${amenityId}`);
            });
            this.venueAmenityMappings = this.venueAmenityMappings.filter(m => m.venueId !== venue.id);
            amenityIds.forEach((amenityId) => {
                this.venueAmenityMappings.push({
                    venueId: venue.id,
                    amenityId
                })
            })
        }
        return venue;
    }
    // delete venue
    deleteVenue(id: string){
        this.getVenueById(id);
        this.venues = this.venues.filter((venue) => venue.id !== id);
        this.venueAmenityMappings = this.venueAmenityMappings.filter(m => m.venueId !== id);
        this.venueCategoryMappings = this.venueCategoryMappings.filter(m => m.venueId !== id);
        this.services = this.services.filter((service) => service.venueId !== id);
    }
    
    // -------ADMIN-----------
    // create category
    createCategory(createCategoryDto: CreateVenueCategoryDto){
        const {name} = createCategoryDto;
        const nameExists = this.categories.find((category) => category.name.toLowerCase() === name.toLowerCase())
        if(nameExists) throw new BadRequestException(`Category ${name} already exists`);
        const category: VenueCategory = {
            id: randomUUID(),
            ...createCategoryDto
        }
        this.categories.push(category);
        return category;
    }
    // delete category
    deleteCategory(id: string){
        this.getCategoryById(id);
        this.categories = this.categories.filter((category) => category.id !== id);
        this.venueCategoryMappings = this.venueCategoryMappings.filter(m => m.categoryId !== id);
    }
    // update category 
    updateCategory(id: string, updateCategoryDto: UpdateVenueCategoryDto){
        const category = this.getCategoryById(id);
        const {name, isActive} = updateCategoryDto;
        if(name){
            const nameExists = this.categories.find((category) => category.id !== id && category.name.toLowerCase() === name.toLowerCase());
            if(nameExists) throw new BadRequestException(`Category ${name} already exists`);
            category.name = name;
        }
        if(isActive !== undefined) category.isActive = isActive;
        return category;
    }
    // create amenities
    createAmenity(createAmenityDto: CreateVenueAmenityDto){
        const {name} = createAmenityDto;
        const nameExists = this.amenities.find((amenity) => amenity.name.toLowerCase() === name.toLowerCase())
        if(nameExists) throw new BadRequestException(`Amenity ${name} already exists`);
        const amenity: VenueAmenity = {
            id: randomUUID(),
            ...createAmenityDto
        }
        this.amenities.push(amenity);
        return amenity;
    }
    // update amenities 
    updateAmenity(id: string, updateVenueAmenityDto: UpdateVenueAmenityDto){
        const amenity = this.getAmenityById(id);
        const { name, isActive } = updateVenueAmenityDto;
           if(name){
            const nameExists = this.amenities.find((amenity) => amenity.id !== id && amenity.name.toLowerCase() === name.toLowerCase());
            if(nameExists) throw new BadRequestException(`Amenity ${name} already exists`);
            amenity.name = name;
        }
        if(isActive !== undefined) amenity.isActive = isActive;
        return amenity;
    }
    // delete amenities
    deleteAmenity(id: string){
        this.getAmenityById(id);
        this.amenities = this.amenities.filter((amenity) => amenity.id !== id)
        this.venueAmenityMappings = this.venueAmenityMappings.filter(m => m.amenityId !== id);
    }
}