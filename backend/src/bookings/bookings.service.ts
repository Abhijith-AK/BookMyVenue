import { BadRequestException, forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateQuoteBookingDto } from './dto/create-quote-booking.dto';
import { VenuesService } from 'src/venues/venues.service';
import { Booking } from './booking.entity';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, EntityManager, In, LessThan, Repository } from 'typeorm';
import { VenueSlot } from 'src/venues/enities/venue-slot.entity';
import { SlotStatus } from 'src/venues/enums/venue.enums';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UsersService } from 'src/users/users.service';
import { BookingStatus } from './enums/booking.enums';
import { PaymentsService } from 'src/payments/payments.service';
import { Cron } from '@nestjs/schedule';
import { Payment } from 'src/payments/payment.entity';
import { PaymentStatus } from 'src/payments/enums/payment.enum';

@Injectable()
export class BookingsService {
    constructor(
        @InjectDataSource()
        private dataSource: DataSource,
        @InjectRepository(Booking)
        private bookingRepository: Repository<Booking>,
        @InjectRepository(VenueSlot)
        private venueSlotRepository: Repository<VenueSlot>,
        @InjectRepository(Payment)
        private paymentRepository: Repository<Payment>,
        private venueService: VenuesService,
        private userService: UsersService,
        @Inject(forwardRef(() => PaymentsService))
        private paymentService: PaymentsService
    ){}    
    // get booking by id
    async getBookingById(id: string): Promise<Booking> {
        const booking = await this.bookingRepository.findOne({where:{id}, relations:{
            venue: true,
            payments: true
        }});
        if(!booking) throw new NotFoundException(`Booking ID ${id} not found`);
        return booking
    }
    // get bookings by customer
    async getBookingByCustomer(customerId: string): Promise<Booking[]> {
        const bookings = await this.bookingRepository.find({where: {
            customerId,
            status: In([
                BookingStatus.CANCELLED,
                BookingStatus.CONFIRMED,
                BookingStatus.FAILED
            ]) 
        },
        relations: {
            venue: true,
            payments: true
        }});
        if(!bookings.length) throw new NotFoundException(`No booking found for CustomerID ${customerId}`);
        return bookings;
    }
    // get bookings by owner
    async getBookingByOwner(ownerId: string): Promise<Booking[]> {
        const venues = await this.venueService.getVenueForOwners(ownerId);
        const venueIds = venues.map(v => v.id);
        const bookings = await this.bookingRepository.createQueryBuilder("booking")
                                    .leftJoinAndSelect("booking.venue", "venue")
                                    .leftJoinAndSelect("booking.payments", "payments")
                                    .where("booking.venueId IN (:...venueIds)", {venueIds})
                                    .andWhere("booking.status IN (:...statuses)", {statuses: [BookingStatus.CONFIRMED, BookingStatus.CANCELLED]})
                                    .getMany();
        if(!bookings.length) throw new NotFoundException(`No booking found for OwnerID ${ownerId}`);
        return bookings;
    }
    // get all bookings
    async getAllBookings(): Promise<Booking[]> {
        return await this.bookingRepository.find();
    }
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
            const booking = await this.dataSource.transaction(async (manager) => {  

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

            if (!booking) throw new Error("Booking creation failed");

            const order =  await this.paymentService.createOrder(booking.totalAmount, `receipt_${booking.id}`);
            await this.paymentService.createPaymentRecord(booking.id, order.id, booking.totalAmount);
            
            return { booking, order };

        }catch(err: any){
            if(err.code === "23505" &&
                err.constraint === "UQ_VENUE_SLOT_START"
            ) {
                throw new BadRequestException("One or more selected slots have already been booked.");
            }
            throw err;
        }
    }
    // booking expire
    @Cron('*/5 * * * *')
    async expirePendingBookings() {
        const expiryTime = new Date(
            Date.now() - 15 * 60 * 1000
        );
        const payments = await this.paymentRepository.find({where: {
            status: PaymentStatus.PENDING,
            createdAt: LessThan(expiryTime),
        }})
        for (const payment of payments)
            {
                try {
                    await this.paymentService.failedPayment(payment.razorpayOrderId);
                } catch (error) {
                    console.error(`Failed to expire payment ${payment.id}`,
                        error
                    );
                }
            }
    }
    // booking failed
    async failedBooking(bookingId: string, manager: EntityManager){
            const bookingRepository = manager.getRepository(Booking);
            const venueSlotRepository = manager.getRepository(VenueSlot);
            
            const booking = await bookingRepository.findOne({where: {id: bookingId}, relations: {slots: true}});
            const slots = booking?.slots;

            booking!.status = BookingStatus.FAILED;
            
            await venueSlotRepository.delete({bookingId})
            await bookingRepository.save(booking!);
    }
    // booking confirmed
    async confirmedBooking(bookingId: string, manager: EntityManager){
            const bookingRepository = manager.getRepository(Booking);
            const venueSlotRepository = manager.getRepository(VenueSlot);

            const booking = await bookingRepository.findOne({where: {id: bookingId}, relations: {slots: true}});
            const slots = booking?.slots;

            booking!.status = BookingStatus.CONFIRMED;
            slots?.forEach(slot => slot.status = SlotStatus.BOOKED);

            await bookingRepository.save(booking!);
            await venueSlotRepository.save(slots!);
    }
    // completed bookings
    @Cron('*/10 * * * *')
    async completeBookings() {
        const confirmedBookings = await this.bookingRepository.find(
            {
                where: { status: BookingStatus.CONFIRMED },
                relations: { slots: true }
            }
        );
        const now = Date.now();
        for (const booking of confirmedBookings){        
            if (!booking.slots.length) continue;
            const latestEndTime = Math.max(...booking.slots.map(s => s.endAt.getTime()));
            if(latestEndTime < now){
                booking.status = BookingStatus.COMPLETED;
                await this.bookingRepository.save(booking);
            }
        }
    }
    // cancel booking
    async cancelBooking(bookingId: string, reason?: string){
        const booking = await this.bookingRepository.findOne({where: {id: bookingId}, relations:{slots: true, venue: true}});
        if(!booking) throw new NotFoundException(`Booking ID ${bookingId} not found`);
        if(booking.status !== BookingStatus.CONFIRMED) throw new BadRequestException("Only confirmed bookings can be cancelled");

        const firstSlot = booking.slots.sort((a, b) => a.startAt.getTime() - b.startAt.getTime())[0];
        const hoursUntilEvent = (firstSlot.startAt.getTime() - Date.now()) / (1000 * 60 * 60);
        if (hoursUntilEvent <= 0) throw new BadRequestException("Cannot cancel past bookings.");
        // refund policy
        const refundPercentage = hoursUntilEvent >= 48 ? 100 : 50;
        const refundAmount = booking.totalAmount * (refundPercentage / 100);

        const refund = await this.paymentService.refundPayment(bookingId, refundAmount, reason);

        return {booking}
    }
    // update canceled booking
    async updateCancelledBooking(bookingId: string, manager: EntityManager, reason?: string){
        const bookingRepository = manager.getRepository(Booking);
        const venueSlotRepository = manager.getRepository(VenueSlot);

        const booking = await bookingRepository.findOne({where: {id: bookingId}, relations: {slots: true}});
        const slots = booking?.slots;

        booking!.status = BookingStatus.CANCELLED;
        if(reason) booking!.cancellationReason = reason;

        await venueSlotRepository.delete({bookingId});
        await bookingRepository.save(booking!);
    }
}
