import { Module } from '@nestjs/common';
import { OwnerController } from './owner.controller';
import { OwnerService } from './owner.service';
import { VenuesModule } from 'src/venues/venues.module';
import { BookingsModule } from 'src/bookings/bookings.module';
import { ReviewsModule } from 'src/reviews/reviews.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Review } from 'src/reviews/review.entity';
import { Booking } from 'src/bookings/booking.entity';
import { Venue } from 'src/venues/enities/venue.entity';
import { User } from 'src/users/user.entity';

@Module({
  imports: [VenuesModule, BookingsModule, ReviewsModule,
    TypeOrmModule.forFeature([Review, Booking, Venue, User])
  ],
  controllers: [OwnerController],
  providers: [OwnerService]
})
export class OwnerModule {}
