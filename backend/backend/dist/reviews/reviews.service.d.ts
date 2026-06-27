import { Review } from './review.entity';
import { Repository } from 'typeorm';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { BookingsService } from "../bookings/bookings.service";
import { JwtUser } from "../auth/get-user.models";
export declare class ReviewsService {
    private reviewRepository;
    private bookingsService;
    constructor(reviewRepository: Repository<Review>, bookingsService: BookingsService);
    getAllReviews(): Promise<Review[]>;
    getReviewsByVenue(venueId: string): Promise<any[]>;
    getReviewByBooking(bookingId: string): Promise<Review>;
    createReview(customerId: string, createReviewDto: CreateReviewDto): Promise<Review>;
    updateReview(customerId: string, id: string, updateReviewDto: UpdateReviewDto): Promise<Review>;
    deleteReview(user: JwtUser, id: string): Promise<void>;
    getReviewsForOwner(ownerId: string): Promise<any[]>;
}
