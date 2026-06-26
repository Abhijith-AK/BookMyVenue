import { Body, Controller, Get, Param, ParseUUIDPipe, Patch, Post } from '@nestjs/common';
import { Booking } from './booking.entity';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { CreateQuoteBookingDto } from './dto/create-quote-booking.dto';
import { CancelBookingDto } from './dto/cancel-bookin.dto';

@Controller('bookings')
export class BookingsController {
    constructor(private bookingsService: BookingsService){}
    // get all bookings
    @Get()
    async getAllBookings(): Promise<Booking[]>{
        return this.bookingsService.getAllBookings();
    }
    // create booking
    @Post()
    async createBooking(@Body() createBookingDto: CreateBookingDto){
        return this.bookingsService.createBooking(createBookingDto);
    }
    // create booking quote
    @Post("quote")
    async createBookingQuote(@Body() createbookingQuoteDto: CreateQuoteBookingDto){
        return this.bookingsService.createBookingQuote(createbookingQuoteDto);
    }
    // cancel booking
    @Patch(":id/cancel")
    async cancelBooking(@Param('id', new ParseUUIDPipe()) id: string, @Body() cancelBookingDto: CancelBookingDto){
        return this.bookingsService.cancelBooking( id, cancelBookingDto.reason)
    }
    // get bookings by customer
    @Get("customer/:customerId")
    async getBookingsByCustomer(@Param('customerId', new ParseUUIDPipe()) customerId: string): Promise<Booking[]> {
        return this.bookingsService.getBookingByCustomer(customerId);
    }
    // get bookings by owner
    @Get("owner/:ownerId")
    async getBookingsByOwner(@Param('ownerId', new ParseUUIDPipe()) ownerId: string): Promise<Booking[]>{
        return this.bookingsService.getBookingByOwner(ownerId);
    }
    // get booking by id
    @Get(":id")
    async getBookingById(@Param('id', new ParseUUIDPipe()) id: string): Promise<Booking> {
        return this.bookingsService.getBookingById(id);
    }
}
