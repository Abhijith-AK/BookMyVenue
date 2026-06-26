import { ReviewsService } from './reviews.service';
import { Review } from './review.entity';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
export declare class ReviewsController {
    private reviewsService;
    constructor(reviewsService: ReviewsService);
    getAllReviews(): Promise<Review[]>;
    getReviewsByVenue(id: string): Promise<any[]>;
    getReviewByBooking(id: string): Promise<Review>;
    createReview(createReviewDto: CreateReviewDto): Promise<Review>;
    updateReview(id: string, updateReviewDto: UpdateReviewDto): Promise<Review>;
    deleteReview(id: string): Promise<void>;
}
