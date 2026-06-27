import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import type { JwtUser } from "../auth/get-user.models";
export declare class ReviewsController {
    private reviewsService;
    constructor(reviewsService: ReviewsService);
    getAllReviews(): Promise<import("./review.entity").Review[]>;
    getReviewsByVenue(id: string): Promise<any[]>;
    getReviewByBooking(id: string): Promise<import("./review.entity").Review>;
    createReview(user: JwtUser, createReviewDto: CreateReviewDto): Promise<import("./review.entity").Review>;
    updateReview(user: JwtUser, id: string, updateReviewDto: UpdateReviewDto): Promise<import("./review.entity").Review>;
    deleteReview(user: JwtUser, id: string): Promise<void>;
}
