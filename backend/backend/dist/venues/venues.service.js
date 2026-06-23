"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VenuesService = void 0;
const common_1 = require("@nestjs/common");
const venue_enums_1 = require("./enums/venue.enums");
const typeorm_1 = require("@nestjs/typeorm");
const venue_entity_1 = require("./enities/venue.entity");
const typeorm_2 = require("typeorm");
const venue_slot_entity_1 = require("./enities/venue-slot.entity");
const venue_service_entity_1 = require("./enities/venue-service.entity");
const venue_category_entity_1 = require("./enities/venue-category.entity");
const venue_amenity_entity_1 = require("./enities/venue-amenity.entity");
let VenuesService = class VenuesService {
    venueRepository;
    venueSlotRepository;
    venueServiceRepository;
    venueCategoryRepository;
    venueAmenityRepository;
    constructor(venueRepository, venueSlotRepository, venueServiceRepository, venueCategoryRepository, venueAmenityRepository) {
        this.venueRepository = venueRepository;
        this.venueSlotRepository = venueSlotRepository;
        this.venueServiceRepository = venueServiceRepository;
        this.venueCategoryRepository = venueCategoryRepository;
        this.venueAmenityRepository = venueAmenityRepository;
    }
    weekDays = [
        venue_enums_1.WeekDays.SUNDAY,
        venue_enums_1.WeekDays.MONDAY,
        venue_enums_1.WeekDays.TUESDAY,
        venue_enums_1.WeekDays.WEDNESDAY,
        venue_enums_1.WeekDays.THURSDAY,
        venue_enums_1.WeekDays.FRIDAY,
        venue_enums_1.WeekDays.SATURDAY,
    ];
    toMinutes(time) {
        const [h, m] = time.split(":").map(Number);
        return h * 60 + m;
    }
    ;
    toDate(date) {
        return date.toISOString().split("T")[0];
    }
    ;
    generateSlots(venue, venueSlots, date) {
        const slots = [];
        const { openingTime, closingTime, id, pricePerSlot, slotDurationMinutes, bookingBufferMinutes } = venue;
        const now = new Date();
        let startAt = new Date(date);
        const endTime = new Date(date);
        const [startHours, startMinutes] = openingTime.split(":").map(Number);
        const [endHours, endMinutes] = closingTime.split(":").map(Number);
        startAt.setHours(startHours, startMinutes, 0, 0);
        endTime.setHours(endHours, endMinutes, 0, 0);
        while (startAt < endTime) {
            const end = new Date(startAt);
            end.setMinutes(startAt.getMinutes() + slotDurationMinutes);
            if (end > endTime)
                break;
            const slot = this.venueSlotRepository.create({
                startAt: new Date(startAt),
                endAt: new Date(end),
                price: pricePerSlot,
                status: venue_enums_1.SlotStatus.AVAILABLE,
                venueId: id
            });
            if (new Date(date).toDateString() === now.toDateString() && slot.startAt <= now) {
                startAt = new Date(slot.endAt);
                continue;
            }
            const bookedSlot = venueSlots.find((bslot) => bslot.startAt < slot.endAt && bslot.endAt > slot.startAt);
            if (bookedSlot) {
                startAt = new Date(bookedSlot.endAt);
                startAt.setMinutes(startAt.getMinutes() + bookingBufferMinutes);
                continue;
            }
            slots.push(slot);
            startAt = new Date(slot.endAt);
        }
        return slots;
    }
    async getFilteredVenues(query) {
        const queryBuilder = this.venueRepository.createQueryBuilder('venue')
            .leftJoinAndSelect("venue.categories", "category")
            .where("venue.status = :status", { status: venue_enums_1.VenueStatus.APPROVED });
        if (query.search)
            queryBuilder.andWhere("LOWER(venue.name) LIKE LOWER(:search)", { search: `%${query.search}%` });
        if (query.district)
            queryBuilder.andWhere("venue.district = :district", { district: query.district });
        if (query.capacity !== undefined)
            queryBuilder.andWhere("venue.maxCapacity >= :capacity", { capacity: query.capacity });
        if (query.price !== undefined)
            queryBuilder.andWhere("venue.pricePerSlot <= :price", { price: query.price });
        if (query.date) {
            const date = this.toDate(query.date);
            const weekDay = this.weekDays[query.date.getDay()];
            queryBuilder.andWhere("venue.availableFrom <= :date AND :date <= venue.availableUntil", { date })
                .andWhere("NOT(:weekDay = ANY(venue.weekDayOff))", { weekDay })
                .andWhere("NOT(:date = ANY(venue.holidays))", { date });
        }
        if (query.category)
            queryBuilder.andWhere("category.id = :categoryId", { categoryId: query.category });
        return await queryBuilder.getMany();
    }
    async getVenueById(id, query) {
        const date = query?.date;
        const venue = await this.venueRepository.findOne({ where: { id }, relations: { categories: true, amenities: true } });
        if (!venue)
            throw new common_1.NotFoundException(`the venue with id ${id} not found!`);
        let bookedSlots = [];
        const bookedSlotsQuery = this.venueSlotRepository.createQueryBuilder("venueSlot")
            .where("venueSlot.status = :statusA OR venueSlot.status = :statusB", {
            statusA: venue_enums_1.SlotStatus.BOOKED,
            statusB: venue_enums_1.SlotStatus.HELD
        });
        if (date) {
            const dateObj = date;
            const dateStr = this.toDate(date);
            const todayStr = this.toDate(new Date());
            if (dateStr < this.toDate(venue.availableFrom) || dateStr > this.toDate(venue.availableUntil))
                throw new common_1.BadRequestException(`Date ${date} not valid.`);
            else if (venue.holidays?.some((h) => this.toDate(h) === dateStr))
                throw new common_1.BadRequestException(`Date ${date} in holidays.`);
            else if (venue.weekDayOff?.includes(this.weekDays[dateObj.getDay()]))
                throw new common_1.BadRequestException(`Date ${date} in weekDayOff.`);
            else if (dateStr < todayStr)
                throw new common_1.BadRequestException(`Past date.`);
            else {
                bookedSlotsQuery.andWhere("venueSlot.venueId = :venueId", { venueId: venue.id })
                    .andWhere("DATE(venueSlot.startAt) = :dateStr", { dateStr })
                    .orderBy('venueSlot.startAt', "ASC");
                bookedSlots = await bookedSlotsQuery.getMany();
            }
        }
        const venueServices = await this.venueServiceRepository.find({ where: { venueId: venue.id } });
        return {
            venue,
            slots: date ? this.generateSlots(venue, bookedSlots, date) : [],
            services: venueServices
        };
    }
    async getVenueForOwners(ownerId) {
        return await this.venueRepository.find({ where: { ownerId }, relations: { categories: true, amenities: true } });
    }
    async getAllCategories() {
        return await this.venueCategoryRepository.find();
    }
    async getCategoryById(id) {
        const category = await this.venueCategoryRepository.findOne({ where: { id } });
        if (!category)
            throw new common_1.NotFoundException(`category ${id} not found`);
        return category;
    }
    async getAllAmenities() {
        return await this.venueAmenityRepository.find();
    }
    async getAmenityById(id) {
        const amenity = await this.venueAmenityRepository.findOne({ where: { id } });
        if (!amenity)
            throw new common_1.NotFoundException(`Amenity ${id} not found`);
        return amenity;
    }
    async getAllServices(venueId) {
        await this.getVenueById(venueId);
        return await this.venueServiceRepository.find({ where: { venueId } });
    }
    async createService(serviceDto) {
        await this.getVenueById(serviceDto.venueId);
        const service = this.venueServiceRepository.create({
            ...serviceDto
        });
        await this.venueServiceRepository.save(service);
        return service;
    }
    async updateService(id, updateServiceDto) {
        const { name, price } = updateServiceDto;
        const service = await this.venueServiceRepository.findOne({ where: { id } });
        if (!service)
            throw new common_1.NotFoundException(`service with ${id} not found.`);
        if (name)
            service.name = name;
        if (price !== undefined)
            service.price = price;
        await this.venueServiceRepository.save(service);
        return service;
    }
    async deleteService(id) {
        const result = await this.venueServiceRepository.delete(id);
        if (result.affected === 0)
            throw new common_1.NotFoundException(`Service ${id} not found`);
    }
    async createVenue(createVenueDto) {
        const { categoryIds, amenityIds, ...venueData } = createVenueDto;
        const categories = [];
        const amenities = [];
        const { maxCapacity, minCapacity, availableFrom, availableUntil, openingTime, closingTime, tags, holidays, weekDayOff } = venueData;
        if (maxCapacity < minCapacity || availableFrom > availableUntil || this.toMinutes(openingTime) > this.toMinutes(closingTime))
            throw new common_1.BadRequestException("Invalid venue details");
        for (const categoryId of categoryIds) {
            const category = await this.venueCategoryRepository.findOne({ where: { id: categoryId } });
            if (!category || !category.isActive)
                throw new common_1.BadRequestException(`Invalid Category ${categoryId}`);
            categories.push(category);
        }
        ;
        for (const amenityId of amenityIds) {
            const amenity = await this.venueAmenityRepository.findOne({ where: { id: amenityId } });
            if (!amenity || !amenity.isActive)
                throw new common_1.BadRequestException(`Invalid Amenity ${amenityId}`);
            amenities.push(amenity);
        }
        ;
        const venue = this.venueRepository.create({
            ...venueData,
            categories,
            amenities,
            weekDayOff: weekDayOff ? weekDayOff : [],
            holidays: holidays ? holidays : [],
            tags: tags ? tags : [],
            status: venue_enums_1.VenueStatus.PENDING_APPROVAL,
        });
        await this.venueRepository.save(venue);
        return venue;
    }
    async updateVenue(id, updateVenueDto) {
        const { address, availableFrom, availableUntil, bookingBufferMinutes, closingTime, description, district, holidays, maxCapacity, minCapacity, name, openingTime, photos, pricePerSlot, slotDurationMinutes, tags, weekDayOff, amenityIds, categoryIds } = updateVenueDto;
        const venue = await this.venueRepository.findOne({ where: { id }, relations: { categories: true, amenities: true } });
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
            const categories = [];
            for (const categoryId of categoryIds) {
                const category = await this.venueCategoryRepository.findOne({ where: { id: categoryId } });
                if (!category || !category.isActive)
                    throw new common_1.BadRequestException(`Invalid Category ${categoryId}`);
                categories.push(category);
            }
            ;
            venue.categories = categories;
        }
        if (amenityIds) {
            const amenities = [];
            for (const amenityId of amenityIds) {
                const amenity = await this.venueAmenityRepository.findOne({ where: { id: amenityId } });
                if (!amenity || !amenity.isActive)
                    throw new common_1.BadRequestException(`Invalid Amenity ${amenityId}`);
                amenities.push(amenity);
            }
            ;
            venue.amenities = amenities;
        }
        await this.venueRepository.save(venue);
        return venue;
    }
    async deleteVenue(id) {
        const result = await this.venueRepository.delete(id);
        if (result.affected === 0)
            throw new common_1.NotFoundException(`Venue with ID ${id} not found.`);
    }
    async createCategory(createCategoryDto) {
        const { name } = createCategoryDto;
        const nameExists = await this.venueCategoryRepository.createQueryBuilder("category")
            .where("LOWER(category.name) = LOWER(:name)", { name }).getOne();
        if (nameExists)
            throw new common_1.BadRequestException(`Category ${name} already exists`);
        const category = this.venueCategoryRepository.create({
            ...createCategoryDto
        });
        await this.venueCategoryRepository.save(category);
        return category;
    }
    async deleteCategory(id) {
        const result = await this.venueCategoryRepository.delete(id);
        if (result.affected === 0)
            throw new common_1.NotFoundException(`Category with ID ${id} not found.`);
    }
    async updateCategory(id, updateCategoryDto) {
        const category = await this.getCategoryById(id);
        const { name, isActive } = updateCategoryDto;
        if (name) {
            const nameExists = await this.venueCategoryRepository.createQueryBuilder("category")
                .where("LOWER(category.name) = LOWER(:name)", { name })
                .andWhere("category.id != :id", { id })
                .getOne();
            if (nameExists)
                throw new common_1.BadRequestException(`Category ${name} already exists`);
            category.name = name;
        }
        if (isActive !== undefined)
            category.isActive = isActive;
        await this.venueCategoryRepository.save(category);
        return category;
    }
    async createAmenity(createAmenityDto) {
        const { name } = createAmenityDto;
        const nameExists = await this.venueAmenityRepository.createQueryBuilder("amenity")
            .where("LOWER(amenity.name) = LOWER(:name)", { name }).getOne();
        if (nameExists)
            throw new common_1.BadRequestException(`Amenity ${name} already exists`);
        const amenity = this.venueAmenityRepository.create({
            ...createAmenityDto
        });
        await this.venueAmenityRepository.save(amenity);
        return amenity;
    }
    async updateAmenity(id, updateVenueAmenityDto) {
        const amenity = await this.getAmenityById(id);
        const { name, isActive } = updateVenueAmenityDto;
        if (name) {
            const nameExists = await this.venueAmenityRepository.createQueryBuilder("amenity")
                .where("LOWER(amenity.name) = LOWER(:name)", { name })
                .andWhere("amenity.id != :id", { id })
                .getOne();
            if (nameExists)
                throw new common_1.BadRequestException(`Amenity ${name} already exists`);
            amenity.name = name;
        }
        if (isActive !== undefined)
            amenity.isActive = isActive;
        await this.venueAmenityRepository.save(amenity);
        return amenity;
    }
    async deleteAmenity(id) {
        const result = await this.venueAmenityRepository.delete(id);
        if (result.affected === 0)
            throw new common_1.NotFoundException(`Amenity with ID ${id} not found.`);
    }
};
exports.VenuesService = VenuesService;
exports.VenuesService = VenuesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(venue_entity_1.Venue)),
    __param(1, (0, typeorm_1.InjectRepository)(venue_slot_entity_1.VenueSlot)),
    __param(2, (0, typeorm_1.InjectRepository)(venue_service_entity_1.VenueService)),
    __param(3, (0, typeorm_1.InjectRepository)(venue_category_entity_1.VenueCategory)),
    __param(4, (0, typeorm_1.InjectRepository)(venue_amenity_entity_1.VenueAmenity)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], VenuesService);
//# sourceMappingURL=venues.service.js.map