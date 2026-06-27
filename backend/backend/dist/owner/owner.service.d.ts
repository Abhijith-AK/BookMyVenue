import { Booking } from "../bookings/booking.entity";
import { Review } from "../reviews/review.entity";
import { ReviewsService } from "../reviews/reviews.service";
import { Venue } from "../venues/enities/venue.entity";
import { Repository } from 'typeorm';
export declare class OwnerService {
    private venueRepository;
    private bookingRepository;
    private reviewRepository;
    private reviewService;
    constructor(venueRepository: Repository<Venue>, bookingRepository: Repository<Booking>, reviewRepository: Repository<Review>, reviewService: ReviewsService);
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
    getRecentBookings(ownerId: string): Promise<Booking[]>;
    getRecentReviews(ownerId: string): Promise<any[]>;
}
