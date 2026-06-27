import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Booking } from 'src/bookings/booking.entity';
import { BookingStatus } from 'src/bookings/enums/booking.enums';
import { Review } from 'src/reviews/review.entity';
import { ReviewsService } from 'src/reviews/reviews.service';
import { User } from 'src/users/user.entity';
import { Venue } from 'src/venues/enities/venue.entity';
import { Repository } from 'typeorm';

@Injectable()
export class OwnerService {
    constructor(
        @InjectRepository(Venue)
        private venueRepository: Repository<Venue>,
        @InjectRepository(Booking)
        private bookingRepository: Repository<Booking>,
        @InjectRepository(Review)
        private reviewRepository: Repository<Review>,
        private reviewService: ReviewsService
    ){}
    // owner dashboard
    async getOwnerDashboard(ownerId: string) {
        const venues = await this.venueRepository.find({where: {ownerId}});
        const bookings = await this.bookingRepository.createQueryBuilder("booking").leftJoinAndSelect("booking.venue", "venue")
                                    .where("venue.ownerId = :ownerId", {ownerId}).getMany();
        const reviews = await this.reviewService.getReviewsForOwner(ownerId);

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
        const bookings = await this.bookingRepository.createQueryBuilder("booking").leftJoinAndSelect("booking.venue", "venue")
                                    .where("venue.ownerId = :ownerId", {ownerId})
                                    .orderBy("booking.createdAt", "DESC")
                                    .take(10)
                                    .getMany();
        return bookings;
    }
    // recent reviews
    async getRecentReviews(ownerId: string) {
        const reviews = await this.reviewRepository.createQueryBuilder("review")
            .leftJoin(User, "customer", "customer.id = review.customerId")
            .innerJoin(Venue, "venue", "venue.id = review.venueId AND venue.ownerId = :ownerId", { ownerId })
            .select([
                "review.id AS id",
                "review.rating AS rating",
                "review.comment AS comment",
                "review.createdAt AS createdAt",
                "venue.id AS venueId",
                "venue.name AS venueName",
                "customer.name AS customerName"
            ])
            .orderBy("review.createdAt", "DESC")
            .limit(10)
            .getRawMany();

        return reviews;
    }

}
