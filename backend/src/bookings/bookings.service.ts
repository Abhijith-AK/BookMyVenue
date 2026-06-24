import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateQuoteBookingDto } from './dto/create-quote-booking.dto';
import { VenuesService } from 'src/venues/venues.service';
import { Booking } from './booking.entity';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, EntityManager, Repository } from 'typeorm';
import { VenueSlot } from 'src/venues/enities/venue-slot.entity';
import { SlotStatus } from 'src/venues/enums/venue.enums';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UsersService } from 'src/users/users.service';
import { BookingStatus } from './enums/booking.enums';

@Injectable()
export class BookingsService {
    constructor(
        @InjectDataSource()
        private dataSource: DataSource,
        @InjectRepository(Booking)
        private bookingRepository: Repository<Booking>,
        @InjectRepository(VenueSlot)
        private venueSlotRepository: Repository<VenueSlot>,
        private venueService: VenuesService,
        private userService: UsersService
    ){}    
    // create booking quote
    async createBookingQuote(createQuoteDto: CreateQuoteBookingDto, manager?: EntityManager){
        // transaction purpose
        const slotRepo = manager ? manager.getRepository(VenueSlot) : this.venueSlotRepository;

        const {guestCount, services, slots, venueId} = createQuoteDto;
        // Validate venue exists
        const venue = await this.venueService.getVenueById(venueId);
        // Validate slots exist and are available.
        const blockedVenueSlots = await slotRepo.createQueryBuilder("slot")
                                            .where("slot.status IN (:...statuses) AND slot.venueId = :venueId",
                                                    {statuses: [SlotStatus.BOOKED, SlotStatus.HELD], venueId})
                                            .getMany();
        if (slots.some(slot => blockedVenueSlots.some(b => b.startAt.getTime() === slot.startAt.getTime()
                                && b.endAt.getTime() === slot.endAt.getTime())))
            throw new BadRequestException(`Invalid slots selected`);
        // Validate services belong to the venue.
        const venueServices = await this.venueService.getAllServices(venueId)
        services.forEach((service) => {
            const validService = venueServices.some((vservice) => vservice.id === service.serviceId);
            if(!validService) throw new BadRequestException(`Invalid service ${service.serviceId} found.`);
        })

        if(
            guestCount < venue.venue.minCapacity ||
            guestCount > venue.venue.maxCapacity
        )
        throw new BadRequestException(`Invalid guest count.`)

        // Calculate slot total.
        const slotTotal = slots.length * venue.venue.pricePerSlot;

        // Calculate services total.
        let serviceTotal = 0;
        services.forEach((service) => {
            const vservice = venueServices.find(s => s.id === service.serviceId);
            serviceTotal += (vservice!.price * service.quantity)
        });

        // Calculate grand total.
        const grandTotal = slotTotal + serviceTotal;
        // Return a quote.
        return {
            venue: venue.venue,
            slotTotal,
            serviceTotal,
            grandTotal
        }
    }

    // create booking
    async createBooking(createBookingDto: CreateBookingDto){
        try{
            return await this.dataSource.transaction(async (manager) => {  

                const bookingRepository = manager.getRepository(Booking);
                const venueSlotRepository = manager.getRepository(VenueSlot);

                const {customerId, ...quoteDto} = createBookingDto;
                const {guestCount, slots, venueId} = quoteDto;
                await this.userService.getUserById(customerId);
                const quote = await this.createBookingQuote(quoteDto, manager);

                const booking: Booking = bookingRepository.create({
                    customerId,
                    guestCount,
                    status: BookingStatus.PENDING,
                    venueId,
                    servicesAmount: quote.serviceTotal,
                    slotsAmount: quote.slotTotal,
                    totalAmount: quote.grandTotal,
                })
                
                const bookedSlots = slots.map(s => venueSlotRepository.create({
                    booking,
                    price: quote.venue.pricePerSlot,
                    startAt: s.startAt,
                    endAt: s.endAt,
                    status: SlotStatus.HELD,
                    venueId
                }))
                
                await bookingRepository.save(booking);
                booking.slots = bookedSlots;
                await venueSlotRepository.save(bookedSlots);

                return await bookingRepository.findOne({
                    where: {id: booking.id},
                    relations: {
                        slots: true,
                        venue: true
                    }
                })
            })
        }catch(err: any){
            if(err.code === "23505" &&
                err.constraint === "UQ_VENUE_SLOT_START"
            ) {
                throw new BadRequestException("One or more selected slots have already been booked.");
            }
            throw err;
        }
    }
    // cancel booking
}
