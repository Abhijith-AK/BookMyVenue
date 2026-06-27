import { Booking } from "../bookings/booking.entity";
import { BookingsService } from "../bookings/bookings.service";
import { Review } from "../reviews/review.entity";
import { UsersService } from "../users/users.service";
import { VenuesService } from "../venues/venues.service";
import { Repository } from 'typeorm';
export declare class AdminService {
    private bookingRepository;
    private reviewRepository;
    private venuesService;
    private bookingsService;
    private usersService;
    constructor(bookingRepository: Repository<Booking>, reviewRepository: Repository<Review>, venuesService: VenuesService, bookingsService: BookingsService, usersService: UsersService);
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
    getRecentBookings(): Promise<Booking[]>;
    getRecentReviews(): Promise<Review[]>;
}
