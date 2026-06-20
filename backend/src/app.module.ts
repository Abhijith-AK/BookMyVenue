import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { VenuesModule } from './venues/venues.module';
import { BookingsModule } from './bookings/bookings.module';

@Module({
  imports: [UsersModule, VenuesModule, BookingsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
