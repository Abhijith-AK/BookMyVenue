import { OwnerService } from './owner.service';
export declare class OwnerController {
    private ownerService;
    constructor(ownerService: OwnerService);
    getDashboard(user: any): Promise<{
        totalVenues: number;
        totalBookings: number;
        completedBookings: number;
        confirmedBookings: number;
        cancelledBookings: number;
        totalRevenue: number;
        averageRating: number;
        totalReviews: number;
    }>;
    getRecentBookings(user: any): Promise<import("../bookings/booking.entity").Booking[]>;
    getRecentReviews(user: any): Promise<any[]>;
}
