import { Injectable } from '@nestjs/common';
import { BookingsService } from 'src/bookings/bookings.service';
import { BookingStatus } from 'src/bookings/enums/booking.enums';
import { ReviewsService } from 'src/reviews/reviews.service';
import { VenuesService } from 'src/venues/venues.service';

@Injectable()
export class OwnerService {
    constructor(
        private venuesService: VenuesService,
        private bookingsService: BookingsService,
        private reviewsService: ReviewsService
    ){}
    // owner dashboard
    async getOwnerDashboard(ownerId: string) {
        const venues = await this.venuesService.getVenueForOwners(ownerId);
        const bookings = await this.bookingsService.getBookingByOwner(ownerId);
        const reviews = await this.reviewsService.getReviewsForOwner(ownerId);

        const totalVenues = venues.length;
        const totalBookings = bookings.length;
        const completedBookings = bookings.filter(b => b.status === BookingStatus.COMPLETED).length;
        const confirmedBookings = bookings.filter(b => b.status === BookingStatus.CONFIRMED).length;
        const cancelledBookings = bookings.filter(b => b.status === BookingStatus.CANCELLED).length;
        const totalRevenue = bookings.filter(b => b.status === BookingStatus.COMPLETED || b.status === BookingStatus.CONFIRMED)
                                     .reduce((total, b) => total + b.totalAmount, 0);
        const averageRating = reviews.length === 0 ? 0 : reviews.reduce((total, r) => total + r.rating, 0) / reviews.length;
        const totalReviews = reviews.length;

        return {
            totalVenues,
            totalBookings,
            completedBookings,
            confirmedBookings,
            cancelledBookings,
            totalRevenue,
            averageRating,
            totalReviews
        }
    }
    // recent bookings
    async getRecentBookings(ownerId: string){
        const bookings = await this.bookingsService.getBookingByOwner(ownerId);
        return bookings.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()).splice(0, 10);
    }
    // recent reviews
    async getRecentReviews(ownerId: string){
        const reviews = await this.reviewsService.getReviewsForOwner(ownerId);
        return reviews.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()).splice(0, 10);
    }
}
