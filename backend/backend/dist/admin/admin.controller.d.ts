import { AdminService } from './admin.service';
export declare class AdminController {
    private adminService;
    constructor(adminService: AdminService);
    getDashboard(): Promise<{
        totalVenues: number;
        totalOwners: number;
        totalUsers: number;
        completedBookings: number;
        activeBookings: number;
        cancelledBookings: number;
        totalRevenue: number;
        pendingVenueApprovals: number;
    }>;
    GetRecentBookings(): Promise<import("../bookings/booking.entity").Booking[]>;
    getRecentReviews(): Promise<import("../reviews/review.entity").Review[]>;
}
