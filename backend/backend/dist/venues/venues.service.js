"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VenuesService = void 0;
const common_1 = require("@nestjs/common");
const venue_model_1 = require("./models/venue.model");
const crypto_1 = require("crypto");
let VenuesService = class VenuesService {
    venues = [];
    categories = [];
    amenities = [];
    services = [];
    venueCategoryMappings = [];
    venueAmenityMappings = [];
    toMinutes(time) {
        const [h, m] = time.split(":").map(Number);
        return h * 60 + m;
    }
    getAllVenues() {
        return this.venues.filter((venue) => venue.status === venue_model_1.VenueStatus.APPROVED);
    }
    getFilteredVenues(query) {
        let filteredVenues = this.venues.filter((venue) => venue.status === venue_model_1.VenueStatus.APPROVED);
        if (query.search)
            filteredVenues = filteredVenues.filter((venue) => venue.name.toLowerCase().includes(query.search.toLowerCase()));
        if (query.district)
            filteredVenues = filteredVenues.filter((venue) => venue.district === query.district);
        if (query.capacity !== undefined)
            filteredVenues = filteredVenues.filter((venue) => venue.maxCapacity >= query.capacity);
        if (query.price !== undefined)
            filteredVenues = filteredVenues.filter((venue) => venue.pricePerSlot <= query.price);
        if (query.date)
            filteredVenues = filteredVenues.filter((venue) => {
                const weekDays = [
                    venue_model_1.WeekDays.SUNDAY,
                    venue_model_1.WeekDays.MONDAY,
                    venue_model_1.WeekDays.TUESDAY,
                    venue_model_1.WeekDays.WEDNESDAY,
                    venue_model_1.WeekDays.THURSDAY,
                    venue_model_1.WeekDays.FRIDAY,
                    venue_model_1.WeekDays.SATURDAY,
                ];
                const weekDay = weekDays[query.date.getDay()];
                if (venue.weekDayOff.includes(weekDay))
                    return false;
                const isHoliday = venue.holidays.some(holiday => holiday.toDateString() === query.date.toDateString());
                if (isHoliday)
                    return false;
                return venue.availableFrom <= query.date && query.date <= venue.availableUntil;
            });
        if (query.category)
            filteredVenues = filteredVenues.filter((venue) => this.venueCategoryMappings.some(m => m.categoryId === query.category && m.venueId === venue.id));
        return filteredVenues;
    }
    getVenueById(id) {
        const venue = this.venues.find((venue) => venue.id === id);
        if (!venue)
            throw new common_1.NotFoundException(`the venue with id ${id} not found!`);
        return venue;
    }
    getVenueForOwners(ownerId) {
        return this.venues.filter((venue) => venue.ownerId === ownerId);
    }
    getAllCategories() {
        return this.categories;
    }
    getCategoryById(id) {
        const category = this.categories.find((category) => category.id === id);
        if (!category)
            throw new common_1.NotFoundException(`category ${id} not found`);
        return category;
    }
    getAllAmenities() {
        return this.amenities;
    }
    getAmenityById(id) {
        const amenity = this.amenities.find((amenity) => amenity.id === id);
        if (!amenity)
            throw new common_1.NotFoundException(`Amenity ${id} not found`);
        return amenity;
    }
    getAllServices(venueId) {
        return this.services.filter((venue) => venue.venueId === venueId);
    }
    createService(serviceDto) {
        this.getVenueById(serviceDto.venueId);
        const service = {
            id: (0, crypto_1.randomUUID)(),
            ...serviceDto
        };
        this.services.push(service);
        return this.services;
    }
    updateService(id, updateServiceDto) {
        const { name, price } = updateServiceDto;
        const service = this.services.find((service) => service.id === id);
        if (!service)
            throw new common_1.NotFoundException(`service with ${id} not found.`);
        if (name)
            service.name = name;
        if (price !== undefined)
            service.price = price;
        return service;
    }
    deleteService(id) {
        const service = this.services.find((service) => service.id === id);
        if (!service)
            throw new common_1.NotFoundException(`Service ${service} not found`);
        this.services = this.services.filter((service) => service.id !== id);
    }
    createVenue(createVenueDto) {
        const { categoryIds, amenityIds, ...venueData } = createVenueDto;
        const { maxCapacity, minCapacity, availableFrom, availableUntil, openingTime, closingTime, tags, holidays, weekDayOff } = venueData;
        if (maxCapacity < minCapacity || availableFrom > availableUntil || this.toMinutes(openingTime) > this.toMinutes(closingTime))
            throw new common_1.BadRequestException("Invalid venue details");
        categoryIds.forEach((categoryId) => {
            const category = this.categories.find((category) => category.id === categoryId);
            if (!category || !category.isActive)
                throw new common_1.BadRequestException(`Invalid Category ${categoryId}`);
        });
        amenityIds.forEach((amenityId) => {
            const amenity = this.amenities.find((amenity) => amenity.id === amenityId);
            if (!amenity || !amenity.isActive)
                throw new common_1.BadRequestException(`Invalid Amenity ${amenityId}`);
        });
        const venue = {
            id: (0, crypto_1.randomUUID)(),
            ...venueData,
            weekDayOff: weekDayOff ? weekDayOff : [],
            holidays: holidays ? holidays : [],
            tags: tags ? tags : [],
            status: venue_model_1.VenueStatus.PENDING_APPROVAL,
            createdAt: new Date()
        };
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
    updateVenue(id, updateVenueDto) {
        const { address, availableFrom, availableUntil, bookingBufferMinutes, closingTime, description, district, holidays, maxCapacity, minCapacity, name, openingTime, photos, pricePerSlot, slotDurationMinutes, tags, weekDayOff, amenityIds, categoryIds } = updateVenueDto;
        const venue = this.venues.find((venue) => venue.id === id);
        if (!venue)
            throw new common_1.NotFoundException(`service with ${id} not found.`);
        const finalAvailableFrom = availableFrom ?? venue.availableFrom;
        const finalAvailableUntil = availableUntil ?? venue.availableUntil;
        const finalMaxCapacity = maxCapacity ?? venue.maxCapacity;
        const finalMinCapacity = minCapacity ?? venue.minCapacity;
        const finalOpeningTime = openingTime ?? venue.openingTime;
        const finalClosingTime = closingTime ?? venue.closingTime;
        if (address)
            venue.address = address;
        if (availableFrom) {
            if (availableFrom < finalAvailableUntil)
                venue.availableFrom = availableFrom;
            else
                throw new common_1.BadRequestException("Invalid venue details - availableFrom");
        }
        ;
        if (availableUntil) {
            if (finalAvailableFrom < availableUntil)
                venue.availableUntil = availableUntil;
            else
                throw new common_1.BadRequestException("Invalid venue details - availableUntil");
        }
        ;
        if (bookingBufferMinutes !== undefined)
            venue.bookingBufferMinutes = bookingBufferMinutes;
        if (closingTime) {
            if (this.toMinutes(closingTime) > this.toMinutes(finalOpeningTime))
                venue.closingTime = closingTime;
            else
                throw new common_1.BadRequestException("Invalid venue details - closingTime");
        }
        ;
        if (description)
            venue.description = description;
        if (district)
            venue.district = district;
        if (holidays)
            venue.holidays = holidays;
        if (maxCapacity !== undefined) {
            if (maxCapacity > finalMinCapacity)
                venue.maxCapacity = maxCapacity;
            else
                throw new common_1.BadRequestException("Invalid venue details - maxCapacity");
        }
        ;
        if (minCapacity !== undefined) {
            if (finalMaxCapacity > minCapacity)
                venue.minCapacity = minCapacity;
            else
                throw new common_1.BadRequestException("Invalid venue details - minCapacity");
        }
        ;
        if (name)
            venue.name = name;
        if (openingTime) {
            if (this.toMinutes(finalClosingTime) > this.toMinutes(openingTime))
                venue.openingTime = openingTime;
            else
                throw new common_1.BadRequestException("Invalid venue details - openingTime");
        }
        ;
        if (photos)
            venue.photos = photos;
        if (pricePerSlot !== undefined)
            venue.pricePerSlot = pricePerSlot;
        if (slotDurationMinutes !== undefined)
            venue.slotDurationMinutes = slotDurationMinutes;
        if (tags)
            venue.tags = tags;
        if (weekDayOff)
            venue.weekDayOff = weekDayOff;
        if (categoryIds) {
            categoryIds.forEach((categoryId) => {
                const category = this.categories.find((category) => category.id === categoryId);
                if (!category || !category.isActive)
                    throw new common_1.BadRequestException(`Invalid Category ${categoryId}`);
            });
            this.venueCategoryMappings = this.venueCategoryMappings.filter(m => m.venueId !== venue.id);
            categoryIds.forEach((categoryId) => {
                this.venueCategoryMappings.push({
                    venueId: venue.id,
                    categoryId
                });
            });
        }
        if (amenityIds) {
            amenityIds.forEach((amenityId) => {
                const amenity = this.amenities.find((amenity) => amenity.id === amenityId);
                if (!amenity || !amenity.isActive)
                    throw new common_1.BadRequestException(`Invalid Amenity ${amenityId}`);
            });
            this.venueAmenityMappings = this.venueAmenityMappings.filter(m => m.venueId !== venue.id);
            amenityIds.forEach((amenityId) => {
                this.venueAmenityMappings.push({
                    venueId: venue.id,
                    amenityId
                });
            });
        }
        return venue;
    }
    deleteVenue(id) {
        this.getVenueById(id);
        this.venues = this.venues.filter((venue) => venue.id !== id);
        this.venueAmenityMappings = this.venueAmenityMappings.filter(m => m.venueId !== id);
        this.venueCategoryMappings = this.venueCategoryMappings.filter(m => m.venueId !== id);
        this.services = this.services.filter((service) => service.venueId !== id);
    }
    createCategory(createCategoryDto) {
        const { name } = createCategoryDto;
        const nameExists = this.categories.find((category) => category.name.toLowerCase() === name.toLowerCase());
        if (nameExists)
            throw new common_1.BadRequestException(`Category ${name} already exists`);
        const category = {
            id: (0, crypto_1.randomUUID)(),
            ...createCategoryDto
        };
        this.categories.push(category);
        return category;
    }
    deleteCategory(id) {
        this.getCategoryById(id);
        this.categories = this.categories.filter((category) => category.id !== id);
        this.venueCategoryMappings = this.venueCategoryMappings.filter(m => m.categoryId !== id);
    }
    updateCategory(id, updateCategoryDto) {
        const category = this.getCategoryById(id);
        const { name, isActive } = updateCategoryDto;
        if (name) {
            const nameExists = this.categories.find((category) => category.id !== id && category.name.toLowerCase() === name.toLowerCase());
            if (nameExists)
                throw new common_1.BadRequestException(`Category ${name} already exists`);
            category.name = name;
        }
        if (isActive !== undefined)
            category.isActive = isActive;
        return category;
    }
    createAmenity(createAmenityDto) {
        const { name } = createAmenityDto;
        const nameExists = this.amenities.find((amenity) => amenity.name.toLowerCase() === name.toLowerCase());
        if (nameExists)
            throw new common_1.BadRequestException(`Amenity ${name} already exists`);
        const amenity = {
            id: (0, crypto_1.randomUUID)(),
            ...createAmenityDto
        };
        this.amenities.push(amenity);
        return amenity;
    }
    updateAmenity(id, updateVenueAmenityDto) {
        const amenity = this.getAmenityById(id);
        const { name, isActive } = updateVenueAmenityDto;
        if (name) {
            const nameExists = this.amenities.find((amenity) => amenity.id !== id && amenity.name.toLowerCase() === name.toLowerCase());
            if (nameExists)
                throw new common_1.BadRequestException(`Amenity ${name} already exists`);
            amenity.name = name;
        }
        if (isActive !== undefined)
            amenity.isActive = isActive;
        return amenity;
    }
    deleteAmenity(id) {
        this.getAmenityById(id);
        this.amenities = this.amenities.filter((amenity) => amenity.id !== id);
        this.venueAmenityMappings = this.venueAmenityMappings.filter(m => m.amenityId !== id);
    }
};
exports.VenuesService = VenuesService;
exports.VenuesService = VenuesService = __decorate([
    (0, common_1.Injectable)()
], VenuesService);
//# sourceMappingURL=venues.service.js.map