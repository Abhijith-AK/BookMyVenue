import { Injectable } from '@nestjs/common';
import { BookingsService } from 'src/bookings/bookings.service';
import { BookingStatus } from 'src/bookings/enums/booking.enums';
import { ReviewsService } from 'src/reviews/reviews.service';
import { UserRole } from 'src/users/user.enums';
import { UsersService } from 'src/users/users.service';
import { VenueStatus } from 'src/venues/enums/venue.enums';
import { VenuesService } from 'src/venues/venues.service';

@Injectable()
export class AdminService {
        constructor(
        private venuesService: VenuesService,
        private bookingsService: BookingsService,
        private reviewsService: ReviewsService,
        private usersService: UsersService
    ){}
    // admin dashboard
    async getAdminDashboard() {
        const users = await this.usersService.getAllUsers();
        const venues = await this.venuesService.getFilteredVenues({});
        const bookings = await this.bookingsService.getAllBookings();

        const totalVenues = venues.length;
        const totalOwners = users.filter(u => u.role === UserRole.OWNER).length;
        const totalUsers = users.filter(u => u.role === UserRole.CUSTOMER).length;
        const completedBookings = bookings.filter(b => b.status === BookingStatus.COMPLETED).length;
        const activeBookings = bookings.filter(b => b.status === BookingStatus.CONFIRMED).length;
        const cancelledBookings = bookings.filter(b => b.status === BookingStatus.CANCELLED).length;
        const totalRevenue = bookings.filter(b => b.status === BookingStatus.COMPLETED || b.status === BookingStatus.CONFIRMED)
                                                    .reduce((total, b) => total + b.totalAmount, 0);
        const pendingVenueApprovals = venues.filter(v => v.status === VenueStatus.PENDING_APPROVAL).length;

        return {
            totalVenues,
            totalOwners,
            totalUsers,
            completedBookings,
            activeBookings,
            cancelledBookings,
            totalRevenue,
            pendingVenueApprovals,
        }
    }
    // recent bookings
    async getRecentBookings(){
        const bookings = await this.bookingsService.getAllBookings();
        return bookings
                .filter(b => b.status === BookingStatus.CONFIRMED)
                .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()).slice(0, 10);
    }
    // recent reviews
    async getRecentReviews(){
        const reviews = await this.reviewsService.getAllReviews();
        return reviews.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()).slice(0, 10);
    }

}
