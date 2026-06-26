import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { ReviewsModule } from 'src/reviews/reviews.module';
import { BookingsModule } from 'src/bookings/bookings.module';
import { VenuesModule } from 'src/venues/venues.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [VenuesModule, BookingsModule, ReviewsModule, UsersModule],
  controllers: [AdminController],
  providers: [AdminService]
})
export class AdminModule {}
