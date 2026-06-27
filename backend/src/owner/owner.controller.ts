import { Controller, Get, UseGuards } from '@nestjs/common';
import { OwnerService } from './owner.service';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import type { JwtUser } from 'src/auth/get-user.models';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserRole } from 'src/users/user.enums';
import { RolesGuard } from 'src/auth/guards/roles.guard';

@UseGuards(RolesGuard)
@Roles(UserRole.OWNER)
@Controller('owner')
export class OwnerController {
    constructor(private ownerService: OwnerService){}

    // GET /owner/dashboard
    @Get('dashboard')
    async getDashboard(@GetUser() user: JwtUser){
        return this.ownerService.getOwnerDashboard(user.id);
    }
    // GET /owner/recent-bookings
    @Get('recent-bookings')
    async getRecentBookings(@GetUser() user: JwtUser){
        return this.ownerService.getRecentBookings(user.id);
    }
    // GET /owner/recent-reviews
    @Get('recent-reviews')
    async getRecentReviews(@GetUser() user: JwtUser){
        return this.ownerService.getRecentReviews(user.id);
    }
}
