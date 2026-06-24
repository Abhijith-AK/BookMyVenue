import { Module } from '@nestjs/common';
import { BookingsController } from './bookings.controller';
import { BookingsService } from './bookings.service';
import { VenuesModule } from 'src/venues/venues.module';
import { UsersModule } from 'src/users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Booking } from './booking.entity';
import { VenueSlot } from 'src/venues/enities/venue-slot.entity';

@Module({
  imports: [VenuesModule, UsersModule, TypeOrmModule.forFeature([Booking, VenueSlot])],
  controllers: [BookingsController],
  providers: [BookingsService]
})
export class BookingsModule {}
