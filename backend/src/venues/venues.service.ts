import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { VenueStatus, WeekDays, SlotStatus } from './enums/venue.enums';
import { GetVenueFilterDto } from './dto/get-venue-filter.dto';
import { CreateVenueServiceDto } from './dto/create-service-venue.dto';
import { UpdateVenueServiceDto } from './dto/update-service-venue.dto';
import { CreateVenueDto } from './dto/create-venue.dto';
import { UpdateVenueDto } from './dto/update-venue.dto';
import { UpdateVenueCategoryDto } from './dto/update-category-venue.dto';
import { CreateVenueCategoryDto } from './dto/create-category-venue.dto';
import { CreateVenueAmenityDto } from './dto/create-amenity-venue.dto';
import { UpdateVenueAmenityDto } from './dto/update-amenity-venue.dto';
import { GetVenueByIdDto } from './dto/get-venue-id.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Venue } from './enities/venue.entity';
import { Repository } from 'typeorm';
import { VenueSlot } from './enities/venue-slot.entity';
import { VenueService } from './enities/venue-service.entity';
import { VenueCategory } from './enities/venue-category.entity';
import { VenueAmenity } from './enities/venue-amenity.entity';

@Injectable()
export class VenuesService {
    constructor(
        @InjectRepository(Venue)
        private venueRepository: Repository<Venue>,
        @InjectRepository(VenueSlot)
        private venueSlotRepository: Repository<VenueSlot>,
        @InjectRepository(VenueService)
        private venueServiceRepository: Repository<VenueService>,
        @InjectRepository(VenueCategory)
        private venueCategoryRepository: Repository<VenueCategory>,
        @InjectRepository(VenueAmenity)
        private venueAmenityRepository: Repository<VenueAmenity>,
    ){}

    private weekDays = [
        WeekDays.SUNDAY,
        WeekDays.MONDAY,
        WeekDays.TUESDAY,
        WeekDays.WEDNESDAY,
        WeekDays.THURSDAY,
        WeekDays.FRIDAY,
        WeekDays.SATURDAY,
    ];
    private toMinutes(time: string): number {
        const [h, m] = time.split(":").map(Number);
        return h * 60 + m;
    };
    private toDate(date: Date): string {
        return date.toISOString().split("T")[0];
    };

    private generateSlots(venue: Venue, venueSlots: VenueSlot[], date: Date){
        const slots: VenueSlot[] = []
        const {openingTime, closingTime, id, pricePerSlot, slotDurationMinutes, bookingBufferMinutes} = venue;
        const now = new Date();
        
        let startAt = new Date(date);
        const endTime = new Date(date);
        const [startHours, startMinutes] = openingTime.split(":").map(Number);
        const [endHours, endMinutes] = closingTime.split(":").map(Number);
        startAt.setHours(startHours, startMinutes, 0, 0);
        endTime.setHours(endHours, endMinutes, 0, 0);
        
        // generate slots
        while(startAt < endTime){
            const end = new Date(startAt);
            end.setMinutes(startAt.getMinutes() + slotDurationMinutes)
            if (end > endTime)
                break;

            const slot: VenueSlot = this.venueSlotRepository.create({
                startAt: new Date(startAt),
                endAt: new Date(end),
                price: pricePerSlot,
                status: SlotStatus.AVAILABLE,
                venueId: id
            })

            // remove slots of past time
            if(new Date(date).toDateString() === now.toDateString() && slot.startAt <= now){
                startAt = new Date(slot.endAt);
                continue;
            }

            // remove booked slots
            const bookedSlot = venueSlots.find((bslot) => bslot.startAt < slot.endAt && bslot.endAt > slot.startAt) //check for overlap
            // add bufferMinutes after bookedSlots
            if(bookedSlot){
                startAt = new Date(bookedSlot.endAt);
                startAt.setMinutes(startAt.getMinutes() + bookingBufferMinutes);
                continue;
            }

            slots.push(slot);
            startAt = new Date(slot.endAt);
        }
        // return available slots
        return slots;
    }

    // -------PUBLIC---------
    // filter venues
    async getFilteredVenues(query: GetVenueFilterDto): Promise<Venue[]> {
        const queryBuilder = this.venueRepository.createQueryBuilder('venue')
                            .leftJoinAndSelect("venue.categories", "category")
                            .where("venue.status = :status", {status: VenueStatus.APPROVED});
        if(query.search)
            queryBuilder.andWhere("LOWER(venue.name) LIKE LOWER(:search)" ,{search: `%${query.search}%` });
        if(query.district)
            queryBuilder.andWhere("venue.district = :district", {district: query.district});
        if(query.capacity !== undefined)
            queryBuilder.andWhere("venue.maxCapacity >= :capacity", {capacity: query.capacity!});
        if(query.price !== undefined)
            queryBuilder.andWhere("venue.pricePerSlot <= :price", {price: query.price!});
        if(query.date){
            const date = this.toDate(query.date);
            const weekDay = this.weekDays[query.date!.getDay()];
            queryBuilder.andWhere("venue.availableFrom <= :date AND :date <= venue.availableUntil", {date})
                        .andWhere("NOT(:weekDay = ANY(venue.weekDayOff))", {weekDay})
                        .andWhere("NOT(:date = ANY(venue.holidays))", {date});
            }
        if(query.category)
            queryBuilder.andWhere("category.id = :categoryId", {categoryId: query.category});
        return await queryBuilder.getMany();  
    }

    // list a venue
    async getVenueById(id: string, query?: GetVenueByIdDto): Promise<{venue: Venue;slots: VenueSlot[];services: VenueService[];}> 
    {
        const date = query?.date; //YYYY-MM-DD
        const venue = await this.venueRepository.findOne({where: {id},  relations:{ categories:true, amenities:true }});
        if(!venue) throw new NotFoundException(`the venue with id ${id} not found!`);
        let bookedSlots: VenueSlot[] = [];
        const bookedSlotsQuery = this.venueSlotRepository.createQueryBuilder("venueSlot")
                                    .where("venueSlot.status = :statusA OR venueSlot.status = :statusB", {
                                        statusA: SlotStatus.BOOKED,
                                        statusB: SlotStatus.HELD
                                    });
        if(date) {
            const dateObj = date;
            const dateStr = this.toDate(date);
            const todayStr = this.toDate(new Date());
            if(dateStr < this.toDate(venue.availableFrom) || dateStr > this.toDate(venue.availableUntil))
                throw new BadRequestException(`Date ${date} not valid.`)
            else if(venue.holidays?.some((h) => this.toDate(h) === dateStr))
                throw new BadRequestException(`Date ${date} in holidays.`)
            else if(venue.weekDayOff?.includes(this.weekDays[dateObj.getDay()]))
                throw new BadRequestException(`Date ${date} in weekDayOff.`)
            else if(dateStr < todayStr)
                throw new BadRequestException(`Past date.`)
            else{
                bookedSlotsQuery.andWhere("venueSlot.venueId = :venueId", {venueId: venue.id})
                                .andWhere("DATE(venueSlot.startAt) = :dateStr", {dateStr})
                                .orderBy('venueSlot.startAt', "ASC");
                bookedSlots = await bookedSlotsQuery.getMany();
            }
        }
        const venueServices: VenueService[] = await this.venueServiceRepository.find({where: {venueId: venue.id}});
        return {
            venue,
            slots: date ? this.generateSlots(venue, bookedSlots, date) : [],
            services: venueServices
        }
    } 

    // -------OWNER-----------
    // list venues by owner
    async getVenueForOwners(ownerId: string): Promise<Venue[]> {
        return await this.venueRepository.find({where: {ownerId},   relations:{ categories:true, amenities:true }});
    }
    // list categorys
    async getAllCategories(): Promise<VenueCategory[]> {
        return await this.venueCategoryRepository.find();
    }
    async getCategoryById(id:string): Promise<VenueCategory> {
        const category = await this.venueCategoryRepository.findOne({where: {id}});
        if(!category) throw new NotFoundException(`category ${id} not found`);
        return category;
    }
    // list amenities 
    async getAllAmenities(): Promise<VenueAmenity[]> {
        return await this.venueAmenityRepository.find();
    }
    async getAmenityById(id: string): Promise<VenueAmenity> {
        const amenity = await this.venueAmenityRepository.findOne({where: {id}});
        if(!amenity) throw new NotFoundException(`Amenity ${id} not found`);
        return amenity;
    }
    // list services by venue
    async getAllServices(venueId: string): Promise<VenueService[]> {
        await this.getVenueById(venueId);
        return await this.venueServiceRepository.find({where: {venueId}});
    }
    // create service
    async createService(serviceDto: CreateVenueServiceDto): Promise<VenueService> {
        await this.getVenueById(serviceDto.venueId);
        const service: VenueService = this.venueServiceRepository.create({
            ...serviceDto
        });
        await this.venueServiceRepository.save(service);
        return service;
    }
    // update service
    async updateService(id: string, updateServiceDto: UpdateVenueServiceDto): Promise<VenueService> {
        const {name, price} = updateServiceDto;
        const service = await this.venueServiceRepository.findOne({where: {id}});
        if(!service) throw new NotFoundException(`service with ${id} not found.`);
        if(name) service.name = name;
        if(price !== undefined) service.price = price;
        await this.venueServiceRepository.save(service);
        return service;
    }
    // delete service
    async deleteService(id: string): Promise<void> {
        const result = await this.venueServiceRepository.delete(id);
        if(result.affected === 0) throw new NotFoundException(`Service ${id} not found`);
    }
    // create venue
    async createVenue(createVenueDto: CreateVenueDto): Promise<Venue> {
        const {categoryIds, amenityIds, ...venueData} = createVenueDto;
        const categories: VenueCategory[] = [];
        const amenities: VenueAmenity[] = [];
        const {maxCapacity, minCapacity, availableFrom, availableUntil, openingTime, closingTime, tags, holidays, weekDayOff} = venueData;
        if(maxCapacity < minCapacity || availableFrom > availableUntil || this.toMinutes(openingTime) > this.toMinutes(closingTime)) 
            throw new BadRequestException("Invalid venue details");
        for (const categoryId of categoryIds){
            const category = await this.venueCategoryRepository.findOne({where: {id: categoryId}});
            if(!category || !category.isActive) throw new BadRequestException(`Invalid Category ${categoryId}`);
            categories.push(category);
        };
        for (const amenityId of amenityIds){
            const amenity = await this.venueAmenityRepository.findOne({where: {id: amenityId}});
            if(!amenity || !amenity.isActive) throw new BadRequestException(`Invalid Amenity ${amenityId}`);
            amenities.push(amenity)
        };

        const venue: Venue = this.venueRepository.create({
            ...venueData,
            categories,
            amenities,
            weekDayOff: weekDayOff ? weekDayOff : [],
            holidays: holidays ? holidays : [],
            tags: tags ? tags : [],
            status: VenueStatus.PENDING_APPROVAL,
        })    
        await this.venueRepository.save(venue);
        return venue;
    }
    // update venue
    async updateVenue(id: string, updateVenueDto: UpdateVenueDto): Promise<Venue>{
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
        const venue = await this.venueRepository.findOne({where: {id}, relations:{ categories:true, amenities:true }});
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
            const categories: VenueCategory[] = [];
            for (const categoryId of categoryIds) {
                const category = await this.venueCategoryRepository.findOne({where: {id: categoryId}});
                if(!category || !category.isActive) throw new BadRequestException(`Invalid Category ${categoryId}`);
                categories.push(category);
            };
           venue.categories = categories;
        }
        if(amenityIds) {
            const amenities: VenueAmenity[] = [];
            for (const amenityId of amenityIds) {
                const amenity = await this.venueAmenityRepository.findOne({where: {id: amenityId}});
                if(!amenity || !amenity.isActive) throw new BadRequestException(`Invalid Amenity ${amenityId}`);
                amenities.push(amenity)
            };
           venue.amenities = amenities;
        }

        await this.venueRepository.save(venue);
        return venue;
    }
    // delete venue
    async deleteVenue(id: string): Promise<void> {
        const result = await this.venueRepository.delete(id);
        if(result.affected === 0) throw new NotFoundException(`Venue with ID ${id} not found.`);
    }
    
    // -------ADMIN-----------
    // create category
    async createCategory(createCategoryDto: CreateVenueCategoryDto): Promise<VenueCategory> {
        const {name} = createCategoryDto;
        const nameExists = await this.venueCategoryRepository.createQueryBuilder("category")
                                    .where("LOWER(category.name) = LOWER(:name)", {name}).getOne();
        if(nameExists) throw new BadRequestException(`Category ${name} already exists`);
        const category: VenueCategory = this.venueCategoryRepository.create({
            ...createCategoryDto
        })
        await this.venueCategoryRepository.save(category);
        return category;
    }
    // delete category
    async deleteCategory(id: string): Promise<void> {
        const result = await this.venueCategoryRepository.delete(id);
        if(result.affected === 0) throw new NotFoundException(`Category with ID ${id} not found.`);
    }
    // update category 
    async updateCategory(id: string, updateCategoryDto: UpdateVenueCategoryDto): Promise<VenueCategory> {
        const category = await this.getCategoryById(id);
        const {name, isActive} = updateCategoryDto;
        if(name){
        const nameExists = await this.venueCategoryRepository.createQueryBuilder("category")
                                    .where("LOWER(category.name) = LOWER(:name)", {name})
                                    .andWhere("category.id != :id", {id})
                                    .getOne();
        if(nameExists) throw new BadRequestException(`Category ${name} already exists`);
        category.name = name;
        }
        if(isActive !== undefined) category.isActive = isActive;
        await this.venueCategoryRepository.save(category);
        return category;
    }
    // create amenities
    async createAmenity(createAmenityDto: CreateVenueAmenityDto): Promise<VenueAmenity> {
        const {name} = createAmenityDto;
        const nameExists = await this.venueAmenityRepository.createQueryBuilder("amenity")
                                    .where("LOWER(amenity.name) = LOWER(:name)", {name}).getOne();
        if(nameExists) throw new BadRequestException(`Amenity ${name} already exists`);
        const amenity: VenueAmenity = this.venueAmenityRepository.create({
            ...createAmenityDto
        })
        await this.venueAmenityRepository.save(amenity);
        return amenity;
    }
    // update amenities 
    async updateAmenity(id: string, updateVenueAmenityDto: UpdateVenueAmenityDto): Promise<VenueAmenity> {
        const amenity = await this.getAmenityById(id);
        const { name, isActive } = updateVenueAmenityDto;
           if(name){
            const nameExists = await this.venueAmenityRepository.createQueryBuilder("amenity")
                                    .where("LOWER(amenity.name) = LOWER(:name)", {name})
                                    .andWhere("amenity.id != :id", {id})
                                    .getOne();
            if(nameExists) throw new BadRequestException(`Amenity ${name} already exists`);
            amenity.name = name;
        }
        if(isActive !== undefined) amenity.isActive = isActive;
        await this.venueAmenityRepository.save(amenity);
        return amenity;
    }
    // delete amenities
    async deleteAmenity(id: string): Promise<void> {
        const result = await this.venueAmenityRepository.delete(id)
        if(result.affected === 0) throw new NotFoundException(`Amenity with ID ${id} not found.`)
    }
}