import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Booking } from './models/booking.model';
import { CreateQuoteBookingDto } from './dto/create-quote-booking.dto';
import { VenuesService } from 'src/venues/venues.service';

@Injectable()
export class BookingsService {
    // constructor(private venueServie: VenuesService){}
    private bookings: Booking[] = [];
    
    // create booking quote
    createBookingQuote(createQuoteDto: CreateQuoteBookingDto){
        const {guestCount, services, slotIds, venueId} = createQuoteDto;
        // Validate venue exists.
        // const venue = this.venueServie.getVenueById(venueId);
        // if(!venue) throw new NotFoundException(`venue ${venueId} not found`);
        // Validate slots exist and are available.
        

        // Validate services belong to the venue.
        // const venueServices = this.venueServie.getAllServices(venueId);
        // if(services.find((service) => venueServices.find((v) => v.id !== service.serviceId)))
            // throw new BadRequestException(`Invalid service found`)
        // Calculate slot total.

        // Calculate services total.
        // Calculate grand total.
        // Return a quote.
    }

    // create booking
    // cancel booking
}
