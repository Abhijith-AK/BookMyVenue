import { Body, Controller, Get } from '@nestjs/common';
import { OwnerService } from './owner.service';

@Controller('owner')
export class OwnerController {
    constructor(private ownerService: OwnerService){}

    // GET /owner/dashboard
    @Get('dashboard')
    async getDashboard(@Body() user){
        return this.ownerService.getOwnerDashboard(user.ownerId);
    }
    // GET /owner/recent-bookings
    @Get('recent-bookings')
    async getRecentBookings(@Body() user){
        return this.ownerService.getRecentBookings(user.ownerId);
    }
    // GET /owner/recent-reviews
    @Get('recent-reviews')
    async getRecentReviews(@Body() user){
        return this.ownerService.getRecentReviews(user.ownerId);
    }
}
