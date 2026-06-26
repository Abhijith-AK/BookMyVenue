import { Module } from '@nestjs/common';
import { OwnerController } from './owner.controller';
import { OwnerService } from './owner.service';
import { VenuesModule } from 'src/venues/venues.module';
import { BookingsModule } from 'src/bookings/bookings.module';
import { ReviewsModule } from 'src/reviews/reviews.module';

@Module({
  imports: [VenuesModule, BookingsModule, ReviewsModule],
  controllers: [OwnerController],
  providers: [OwnerService]
})
export class OwnerModule {}
