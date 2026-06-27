import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Booking } from 'src/bookings/booking.entity';
import { BookingsService } from 'src/bookings/bookings.service';
import { BookingStatus } from 'src/bookings/enums/booking.enums';
import { Review } from 'src/reviews/review.entity';
import { UserRole } from 'src/users/user.enums';
import { UsersService } from 'src/users/users.service';
import { VenueStatus } from 'src/venues/enums/venue.enums';
import { VenuesService } from 'src/venues/venues.service';
import { Repository } from 'typeorm';

@Injectable()
export class AdminService {
        constructor(
        @InjectRepository(Booking)
        private bookingRepository: Repository<Booking>,
        @InjectRepository(Review)
        private reviewRepository: Repository<Review>,
        private venuesService: VenuesService,
        private bookingsService: BookingsService,
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
    async getRecentBookings() {
        return await this.bookingRepository.createQueryBuilder("booking")
            .where("booking.status = :status", { status: BookingStatus.CONFIRMED })
            .orderBy("booking.createdAt", "DESC")
            .take(10)
            .getMany();
    }

    // recent reviews
    async getRecentReviews() {
        return await this.reviewRepository.createQueryBuilder("review")
            .orderBy("review.createdAt", "DESC")
            .take(10)
            .getMany();
    }

}
