import { forwardRef, Module } from '@nestjs/common';
import { BookingsController } from './bookings.controller';
import { BookingsService } from './bookings.service';
import { VenuesModule } from 'src/venues/venues.module';
import { UsersModule } from 'src/users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Booking } from './booking.entity';
import { VenueSlot } from 'src/venues/enities/venue-slot.entity';
import { PaymentsModule } from 'src/payments/payments.module';
import { Payment } from 'src/payments/payment.entity';

@Module({
  imports: [
    forwardRef(() => PaymentsModule),
    VenuesModule,
    UsersModule, 
    TypeOrmModule.forFeature([Booking, VenueSlot, Payment]), 
  ],
  controllers: [BookingsController],
  providers: [BookingsService],
  exports: [BookingsService]
})
export class BookingsModule {}
