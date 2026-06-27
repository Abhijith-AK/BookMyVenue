import { Body, Controller, Get, Param, ParseUUIDPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { Booking } from './booking.entity';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { CreateQuoteBookingDto } from './dto/create-quote-booking.dto';
import { CancelBookingDto } from './dto/cancel-bookin.dto';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserRole } from 'src/users/user.enums';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import type { JwtUser } from 'src/auth/get-user.models';

@Controller('bookings')
export class BookingsController {
    constructor(private bookingsService: BookingsService){}
    // get all bookings
    @UseGuards(RolesGuard)
    @Roles(UserRole.ADMIN)
    @Get()
    async getAllBookings(): Promise<Booking[]>{
        return this.bookingsService.getAllBookings();
    }
    // create booking
    @UseGuards(RolesGuard)
    @Roles(UserRole.CUSTOMER)
    @Post()
    async createBooking(@GetUser() user: JwtUser, @Body() createBookingDto: CreateBookingDto){
        return this.bookingsService.createBooking(user.id, createBookingDto);
    }
    // create booking quote
    @UseGuards(RolesGuard)
    @Roles(UserRole.CUSTOMER)
    @Post("quote")
    async createBookingQuote(@Body() createbookingQuoteDto: CreateQuoteBookingDto){
        return this.bookingsService.createBookingQuote(createbookingQuoteDto);
    }
    // cancel booking
    @UseGuards(RolesGuard)
    @Roles(UserRole.CUSTOMER, UserRole.OWNER)
    @Patch(":id/cancel")
    async cancelBooking(@GetUser() user: JwtUser, @Param('id', new ParseUUIDPipe()) id: string, @Body() cancelBookingDto: CancelBookingDto){
        return this.bookingsService.cancelBooking( id, user, cancelBookingDto.reason)
    }
    // get bookings by customer
    @UseGuards(RolesGuard)
    @Roles(UserRole.CUSTOMER)
    @Get("customer")
    async getBookingsByCustomer(@GetUser() user: JwtUser): Promise<Booking[]> {
        return this.bookingsService.getBookingByCustomer(user.id);
    }
    // get bookings by owner
    @UseGuards(RolesGuard)
    @Roles(UserRole.OWNER)
    @Get("owner")
    async getBookingsByOwner(@GetUser() user: JwtUser): Promise<Booking[]>{
        return this.bookingsService.getBookingByOwner(user.id);
    }
    // get booking by id
    @Get(":id")
    async getBookingById(@Param('id', new ParseUUIDPipe()) id: string): Promise<Booking> {
        return this.bookingsService.getBookingById(id);
    }
}
