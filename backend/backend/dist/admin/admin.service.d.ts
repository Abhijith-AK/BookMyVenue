import { BookingsService } from "../bookings/bookings.service";
import { ReviewsService } from "../reviews/reviews.service";
import { UsersService } from "../users/users.service";
import { VenuesService } from "../venues/venues.service";
export declare class AdminService {
    private venuesService;
    private bookingsService;
    private reviewsService;
    private usersService;
    constructor(venuesService: VenuesService, bookingsService: BookingsService, reviewsService: ReviewsService, usersService: UsersService);
    getAdminDashboard(): Promise<{
        totalVenues: number;
        totalOwners: number;
        totalUsers: number;
        completedBookings: number;
        activeBookings: number;
        cancelledBookings: number;
        totalRevenue: number;
        pendingVenueApprovals: number;
    }>;
    getRecentBookings(): Promise<import("../bookings/booking.entity").Booking[]>;
    getRecentReviews(): Promise<import("../reviews/review.entity").Review[]>;
}
