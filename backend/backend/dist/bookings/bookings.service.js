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
exports.BookingsService = void 0;
const common_1 = require("@nestjs/common");
const venues_service_1 = require("../venues/venues.service");
const booking_entity_1 = require("./booking.entity");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const venue_slot_entity_1 = require("../venues/enities/venue-slot.entity");
const venue_enums_1 = require("../venues/enums/venue.enums");
const users_service_1 = require("../users/users.service");
const booking_enums_1 = require("./enums/booking.enums");
const payments_service_1 = require("../payments/payments.service");
const schedule_1 = require("@nestjs/schedule");
const payment_entity_1 = require("../payments/payment.entity");
const payment_enum_1 = require("../payments/enums/payment.enum");
const user_enums_1 = require("../users/user.enums");
let BookingsService = class BookingsService {
    dataSource;
    bookingRepository;
    venueSlotRepository;
    paymentRepository;
    venueService;
    userService;
    paymentService;
    constructor(dataSource, bookingRepository, venueSlotRepository, paymentRepository, venueService, userService, paymentService) {
        this.dataSource = dataSource;
        this.bookingRepository = bookingRepository;
        this.venueSlotRepository = venueSlotRepository;
        this.paymentRepository = paymentRepository;
        this.venueService = venueService;
        this.userService = userService;
        this.paymentService = paymentService;
    }
    async getBookingById(id) {
        const booking = await this.bookingRepository.findOne({ where: { id }, relations: {
                venue: true,
                payments: true
            } });
        if (!booking)
            throw new common_1.NotFoundException(`Booking ID ${id} not found`);
        return booking;
    }
    async getBookingByCustomer(customerId) {
        const bookings = await this.bookingRepository.find({ where: {
                customerId,
                status: (0, typeorm_2.In)([
                    booking_enums_1.BookingStatus.CANCELLED,
                    booking_enums_1.BookingStatus.CONFIRMED,
                    booking_enums_1.BookingStatus.COMPLETED,
                    booking_enums_1.BookingStatus.FAILED
                ])
            },
            relations: {
                venue: true,
                payments: true
            } });
        if (!bookings.length)
            throw new common_1.NotFoundException(`No booking found for CustomerID ${customerId}`);
        return bookings;
    }
    async getBookingByOwner(ownerId) {
        const venues = await this.venueService.getVenueForOwners(ownerId);
        if (!venues.length)
            throw new common_1.NotFoundException(`No booking found for OwnerID ${ownerId}`);
        const venueIds = venues.map(v => v.id);
        const bookings = await this.bookingRepository.createQueryBuilder("booking")
            .leftJoinAndSelect("booking.venue", "venue")
            .leftJoinAndSelect("booking.payments", "payments")
            .where("booking.venueId IN (:...venueIds)", { venueIds })
            .andWhere("booking.status IN (:...statuses)", { statuses: [booking_enums_1.BookingStatus.CONFIRMED, booking_enums_1.BookingStatus.CANCELLED, booking_enums_1.BookingStatus.COMPLETED] })
            .getMany();
        if (!bookings.length)
            throw new common_1.NotFoundException(`No booking found for OwnerID ${ownerId}`);
        return bookings;
    }
    async getAllBookings() {
        return await this.bookingRepository.find();
    }
    async createBookingQuote(createQuoteDto, manager) {
        const slotRepo = manager ? manager.getRepository(venue_slot_entity_1.VenueSlot) : this.venueSlotRepository;
        const { guestCount, services, slots, venueId } = createQuoteDto;
        const venue = await this.venueService.getVenueById(venueId);
        const blockedVenueSlots = await slotRepo.createQueryBuilder("slot")
            .where("slot.status IN (:...statuses) AND slot.venueId = :venueId", { statuses: [venue_enums_1.SlotStatus.BOOKED, venue_enums_1.SlotStatus.HELD], venueId })
            .getMany();
        if (slots.some(slot => blockedVenueSlots.some(b => b.startAt.getTime() === slot.startAt.getTime()
            && b.endAt.getTime() === slot.endAt.getTime())))
            throw new common_1.BadRequestException(`Invalid slots selected`);
        const venueServices = await this.venueService.getAllServices(venueId);
        services.forEach((service) => {
            const validService = venueServices.some((vservice) => vservice.id === service.serviceId);
            if (!validService)
                throw new common_1.BadRequestException(`Invalid service ${service.serviceId} found.`);
        });
        if (guestCount < venue.venue.minCapacity ||
            guestCount > venue.venue.maxCapacity)
            throw new common_1.BadRequestException(`Invalid guest count.`);
        const slotTotal = slots.length * venue.venue.pricePerSlot;
        let serviceTotal = 0;
        services.forEach((service) => {
            const vservice = venueServices.find(s => s.id === service.serviceId);
            serviceTotal += (vservice.price * service.quantity);
        });
        const grandTotal = slotTotal + serviceTotal;
        return {
            venue: venue.venue,
            slotTotal,
            serviceTotal,
            grandTotal
        };
    }
    async createBooking(customerId, createBookingDto) {
        try {
            const booking = await this.dataSource.transaction(async (manager) => {
                const bookingRepository = manager.getRepository(booking_entity_1.Booking);
                const venueSlotRepository = manager.getRepository(venue_slot_entity_1.VenueSlot);
                const { guestCount, slots, venueId } = createBookingDto;
                await this.userService.getUserById(customerId);
                const quote = await this.createBookingQuote(createBookingDto, manager);
                const booking = bookingRepository.create({
                    customerId,
                    guestCount,
                    status: booking_enums_1.BookingStatus.PENDING,
                    venueId,
                    servicesAmount: quote.serviceTotal,
                    slotsAmount: quote.slotTotal,
                    totalAmount: quote.grandTotal,
                });
                const bookedSlots = slots.map(s => venueSlotRepository.create({
                    bookingId: booking.id,
                    price: quote.venue.pricePerSlot,
                    startAt: s.startAt,
                    endAt: s.endAt,
                    status: venue_enums_1.SlotStatus.HELD,
                    venueId
                }));
                await bookingRepository.save(booking);
                await venueSlotRepository.save(bookedSlots);
                return await bookingRepository.findOne({
                    where: { id: booking.id },
                    relations: {
                        slots: true,
                        venue: true
                    }
                });
            });
            if (!booking)
                throw new Error("Booking creation failed");
            const order = await this.paymentService.createOrder(booking.totalAmount, `receipt_${booking.id.slice(0, 20)}`);
            await this.paymentService.createPaymentRecord(booking.id, order.id, booking.totalAmount);
            return { booking, order };
        }
        catch (err) {
            if (err.code === "23505" &&
                err.constraint === "UQ_VENUE_SLOT_START") {
                throw new common_1.BadRequestException("One or more selected slots have already been booked.");
            }
            throw err;
        }
    }
    async expirePendingBookings() {
        const expiryTime = new Date(Date.now() - 15 * 60 * 1000);
        const payments = await this.paymentRepository.find({ where: {
                status: payment_enum_1.PaymentStatus.PENDING,
                createdAt: (0, typeorm_2.LessThan)(expiryTime),
            } });
        for (const payment of payments) {
            try {
                await this.paymentService.failedPayment(payment.razorpayOrderId);
            }
            catch (error) {
                console.error(`Failed to expire payment ${payment.id}`, error);
            }
        }
    }
    async failedBooking(bookingId, manager) {
        const bookingRepository = manager.getRepository(booking_entity_1.Booking);
        const venueSlotRepository = manager.getRepository(venue_slot_entity_1.VenueSlot);
        const booking = await bookingRepository.findOne({ where: { id: bookingId }, relations: { slots: true } });
        const slots = booking?.slots;
        booking.status = booking_enums_1.BookingStatus.FAILED;
        await venueSlotRepository.delete({ bookingId });
        await bookingRepository.save(booking);
    }
    async confirmedBooking(bookingId, manager) {
        const bookingRepository = manager.getRepository(booking_entity_1.Booking);
        const venueSlotRepository = manager.getRepository(venue_slot_entity_1.VenueSlot);
        const booking = await bookingRepository.findOne({ where: { id: bookingId }, relations: { slots: true } });
        const slots = booking?.slots;
        booking.status = booking_enums_1.BookingStatus.CONFIRMED;
        slots?.forEach(slot => slot.status = venue_enums_1.SlotStatus.BOOKED);
        await bookingRepository.save(booking);
        await venueSlotRepository.save(slots);
    }
    async completeBookings() {
        const confirmedBookings = await this.bookingRepository.find({
            where: { status: booking_enums_1.BookingStatus.CONFIRMED },
            relations: { slots: true }
        });
        const now = Date.now();
        for (const booking of confirmedBookings) {
            if (!booking.slots.length)
                continue;
            const latestEndTime = Math.max(...booking.slots.map(s => s.endAt.getTime()));
            if (latestEndTime < now) {
                booking.status = booking_enums_1.BookingStatus.COMPLETED;
                await this.bookingRepository.save(booking);
            }
        }
    }
    async cancelBooking(bookingId, user, reason) {
        const booking = await this.bookingRepository.findOne({ where: { id: bookingId }, relations: { slots: true, venue: true } });
        if (!booking)
            throw new common_1.NotFoundException(`Booking ID ${bookingId} not found`);
        if (user.role === user_enums_1.UserRole.OWNER && booking.venue.ownerId !== user.id)
            throw new common_1.ForbiddenException();
        if (user.role === user_enums_1.UserRole.CUSTOMER && booking.customerId !== user.id)
            throw new common_1.ForbiddenException();
        if (booking.status !== booking_enums_1.BookingStatus.CONFIRMED)
            throw new common_1.BadRequestException("Only confirmed bookings can be cancelled");
        const firstSlot = booking.slots.sort((a, b) => a.startAt.getTime() - b.startAt.getTime())[0];
        const hoursUntilEvent = (firstSlot.startAt.getTime() - Date.now()) / (1000 * 60 * 60);
        if (hoursUntilEvent <= 0)
            throw new common_1.BadRequestException("Cannot cancel past bookings.");
        const refundPercentage = hoursUntilEvent >= 48 ? 100 : 50;
        const refundAmount = booking.totalAmount * (refundPercentage / 100);
        const refund = await this.paymentService.refundPayment(bookingId, refundAmount, reason);
        return { booking };
    }
    async updateCancelledBooking(bookingId, manager, reason) {
        const bookingRepository = manager.getRepository(booking_entity_1.Booking);
        const venueSlotRepository = manager.getRepository(venue_slot_entity_1.VenueSlot);
        const booking = await bookingRepository.findOne({ where: { id: bookingId }, relations: { slots: true } });
        booking.status = booking_enums_1.BookingStatus.CANCELLED;
        if (reason)
            booking.cancellationReason = reason;
        await venueSlotRepository.delete({ bookingId });
        await bookingRepository.save(booking);
    }
};
exports.BookingsService = BookingsService;
__decorate([
    (0, schedule_1.Cron)('*/5 * * * *'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], BookingsService.prototype, "expirePendingBookings", null);
__decorate([
    (0, schedule_1.Cron)('*/10 * * * *'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], BookingsService.prototype, "completeBookings", null);
exports.BookingsService = BookingsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectDataSource)()),
    __param(1, (0, typeorm_1.InjectRepository)(booking_entity_1.Booking)),
    __param(2, (0, typeorm_1.InjectRepository)(venue_slot_entity_1.VenueSlot)),
    __param(3, (0, typeorm_1.InjectRepository)(payment_entity_1.Payment)),
    __param(6, (0, common_1.Inject)((0, common_1.forwardRef)(() => payments_service_1.PaymentsService))),
    __metadata("design:paramtypes", [typeorm_2.DataSource,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        venues_service_1.VenuesService,
        users_service_1.UsersService,
        payments_service_1.PaymentsService])
], BookingsService);
//# sourceMappingURL=bookings.service.js.map