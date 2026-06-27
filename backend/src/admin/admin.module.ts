import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { ReviewsModule } from 'src/reviews/reviews.module';
import { BookingsModule } from 'src/bookings/bookings.module';
import { VenuesModule } from 'src/venues/venues.module';
import { UsersModule } from 'src/users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Booking } from 'src/bookings/booking.entity';
import { Review } from 'src/reviews/review.entity';

@Module({
  imports: [VenuesModule, BookingsModule, ReviewsModule, UsersModule,
    TypeOrmModule.forFeature([Booking, Review])
  ],
  controllers: [AdminController],
  providers: [AdminService]
})
export class AdminModule {}
