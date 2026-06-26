import { BookingsService } from "../bookings/bookings.service";
import { ReviewsService } from "../reviews/reviews.service";
import { VenuesService } from "../venues/venues.service";
export declare class OwnerService {
    private venuesService;
    private bookingsService;
    private reviewsService;
    constructor(venuesService: VenuesService, bookingsService: BookingsService, reviewsService: ReviewsService);
    getOwnerDashboard(ownerId: string): Promise<{
        totalVenues: number;
        totalBookings: number;
        completedBookings: number;
        confirmedBookings: number;
        cancelledBookings: number;
        totalRevenue: number;
        averageRating: number;
        totalReviews: number;
    }>;
    getRecentBookings(ownerId: string): Promise<import("../bookings/booking.entity").Booking[]>;
    getRecentReviews(ownerId: string): Promise<any[]>;
}
