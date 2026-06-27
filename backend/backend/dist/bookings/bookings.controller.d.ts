import { Booking } from './booking.entity';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { CreateQuoteBookingDto } from './dto/create-quote-booking.dto';
import { CancelBookingDto } from './dto/cancel-bookin.dto';
import type { JwtUser } from "../auth/get-user.models";
export declare class BookingsController {
    private bookingsService;
    constructor(bookingsService: BookingsService);
    getAllBookings(): Promise<Booking[]>;
    createBooking(user: JwtUser, createBookingDto: CreateBookingDto): Promise<{
        booking: Booking;
        order: import("razorpay/dist/types/orders").Orders.RazorpayOrder;
    }>;
    createBookingQuote(createbookingQuoteDto: CreateQuoteBookingDto): Promise<{
        venue: import("../venues/enities/venue.entity").Venue;
        slotTotal: number;
        serviceTotal: number;
        grandTotal: number;
    }>;
    cancelBooking(user: JwtUser, id: string, cancelBookingDto: CancelBookingDto): Promise<{
        booking: Booking;
    }>;
    getBookingsByCustomer(user: JwtUser): Promise<Booking[]>;
    getBookingsByOwner(user: JwtUser): Promise<Booking[]>;
    getBookingById(id: string): Promise<Booking>;
}
