import { CreateQuoteBookingDto } from './dto/create-quote-booking.dto';
import { VenuesService } from "../venues/venues.service";
import { Booking } from './booking.entity';
import { DataSource, EntityManager, Repository } from 'typeorm';
import { VenueSlot } from "../venues/enities/venue-slot.entity";
import { CreateBookingDto } from './dto/create-booking.dto';
import { UsersService } from "../users/users.service";
import { PaymentsService } from "../payments/payments.service";
import { Payment } from "../payments/payment.entity";
export declare class BookingsService {
    private dataSource;
    private bookingRepository;
    private venueSlotRepository;
    private paymentRepository;
    private venueService;
    private userService;
    private paymentService;
    constructor(dataSource: DataSource, bookingRepository: Repository<Booking>, venueSlotRepository: Repository<VenueSlot>, paymentRepository: Repository<Payment>, venueService: VenuesService, userService: UsersService, paymentService: PaymentsService);
    getBookingById(id: string): Promise<Booking>;
    getBookingByCustomer(customerId: string): Promise<Booking[]>;
    getBookingByOwner(ownerId: string): Promise<Booking[]>;
    getAllBookings(): Promise<Booking[]>;
    createBookingQuote(createQuoteDto: CreateQuoteBookingDto, manager?: EntityManager): Promise<{
        venue: import("../venues/enities/venue.entity").Venue;
        slotTotal: number;
        serviceTotal: number;
        grandTotal: number;
    }>;
    createBooking(createBookingDto: CreateBookingDto): Promise<{
        booking: Booking;
        order: import("razorpay/dist/types/orders").Orders.RazorpayOrder;
    }>;
    expirePendingBookings(): Promise<void>;
    failedBooking(bookingId: string, manager: EntityManager): Promise<void>;
    confirmedBooking(bookingId: string, manager: EntityManager): Promise<void>;
    completeBookings(): Promise<void>;
    cancelBooking(bookingId: string, reason?: string): Promise<{
        booking: Booking;
    }>;
    updateCancelledBooking(bookingId: string, manager: EntityManager, reason?: string): Promise<void>;
}
