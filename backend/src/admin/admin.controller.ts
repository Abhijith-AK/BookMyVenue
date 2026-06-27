import { Controller, Get, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { UserRole } from 'src/users/user.enums';
import { Roles } from 'src/auth/decorators/roles.decorator';

@UseGuards(RolesGuard)
@Roles(UserRole.ADMIN)
@Controller('admin')
export class AdminController {
    constructor(private adminService: AdminService){}

    // GET /admin/dashboard
    @Get('dashboard')
    async getDashboard(){
        return this.adminService.getAdminDashboard();
    }
    // GET /admin/recent-bookings
    @Get('recent-bookings')
    async GetRecentBookings(){
        return this.adminService.getRecentBookings()
    }
    // GET /admin/recent-reviews
    @Get('recent-reviews')
    async getRecentReviews(){
        return this.adminService.getRecentReviews()
    }
}
