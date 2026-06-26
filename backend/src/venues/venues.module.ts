import { Module } from '@nestjs/common';
import { VenuesController } from './venues.controller';
import { VenuesService } from './venues.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Venue } from './enities/venue.entity';
import { VenueAmenity } from './enities/venue-amenity.entity';
import { VenueCategory } from './enities/venue-category.entity';
import { VenueService } from './enities/venue-service.entity';
import { VenueSlot } from './enities/venue-slot.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Venue, VenueAmenity, VenueCategory, VenueService, VenueSlot])],
  controllers: [VenuesController],
  providers: [VenuesService],
  exports: [VenuesService]
})
export class VenuesModule {}
