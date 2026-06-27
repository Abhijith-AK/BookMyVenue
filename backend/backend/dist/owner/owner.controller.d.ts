import { OwnerService } from './owner.service';
import type { JwtUser } from "../auth/get-user.models";
export declare class OwnerController {
    private ownerService;
    constructor(ownerService: OwnerService);
    getDashboard(user: JwtUser): Promise<{
        totalVenues: number;
        totalBookings: number;
        completedBookings: number;
        confirmedBookings: number;
        cancelledBookings: number;
        totalRevenue: number;
        averageRating: number;
        totalReviews: number;
    }>;
    getRecentBookings(user: JwtUser): Promise<import("../bookings/booking.entity").Booking[]>;
    getRecentReviews(user: JwtUser): Promise<any[]>;
}
