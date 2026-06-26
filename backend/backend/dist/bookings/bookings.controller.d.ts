import { Booking } from './booking.entity';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { CreateQuoteBookingDto } from './dto/create-quote-booking.dto';
import { CancelBookingDto } from './dto/cancel-bookin.dto';
export declare class BookingsController {
    private bookingsService;
    constructor(bookingsService: BookingsService);
    getAllBookings(): Promise<Booking[]>;
    createBooking(createBookingDto: CreateBookingDto): Promise<{
        booking: Booking;
        order: import("razorpay/dist/types/orders").Orders.RazorpayOrder;
    }>;
    createBookingQuote(createbookingQuoteDto: CreateQuoteBookingDto): Promise<{
        venue: import("../venues/enities/venue.entity").Venue;
        slotTotal: number;
        serviceTotal: number;
        grandTotal: number;
    }>;
    cancelBooking(id: string, cancelBookingDto: CancelBookingDto): Promise<{
        booking: Booking;
    }>;
    getBookingsByCustomer(customerId: string): Promise<Booking[]>;
    getBookingsByOwner(ownerId: string): Promise<Booking[]>;
    getBookingById(id: string): Promise<Booking>;
}
