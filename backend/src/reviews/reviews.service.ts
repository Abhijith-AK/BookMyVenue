import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Review } from './review.entity';
import { Repository } from 'typeorm';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { User } from 'src/users/user.entity';
import { Booking } from 'src/bookings/booking.entity';
import { BookingsService } from 'src/bookings/bookings.service';
import { BookingStatus } from 'src/bookings/enums/booking.enums';

@Injectable()
export class ReviewsService {
    constructor(
        @InjectRepository(Review)
        private reviewRepository: Repository<Review>,
        private bookingsService: BookingsService
    ){}
    // get all reviews
    async getAllReviews(){
        return await this.reviewRepository.find();
    }
    // get reviews by venue
    async getReviewsByVenue(venueId: string){
        const reviews = await this.reviewRepository.createQueryBuilder("review")
        .leftJoin(User, "customer", "customer.id = review.customerId")
        .leftJoin(Booking, "booking", "booking.id = review.bookingId")
        .select("review")
        .addSelect("customer.name", "customerName")
        .addSelect("booking.status", "bookingStatus")
        .where("review.venueId = :venueId", { venueId })
        .getRawMany();;
        if(!reviews.length) throw new NotFoundException(`No reviews found for Venue-${venueId}`);
        return reviews;
    }
    // get review by bookingId
    async getReviewByBooking(bookingId: string){
        const review = await this.reviewRepository.findOne({where:{ bookingId }});
        if(!review) throw new NotFoundException(`review not found for ${bookingId}`);
        return review;
    }
    // create review
    async createReview(createReviewDto: CreateReviewDto){
        // TODO: validate customer
        const existing = await this.reviewRepository.findOne({where: {bookingId: createReviewDto.bookingId}});
        if(existing) throw new BadRequestException(`review already exists for booking ${createReviewDto.bookingId}`);
        const booking = await this.bookingsService.getBookingById(createReviewDto.bookingId);
        if(booking.status !== BookingStatus.COMPLETED) throw new ForbiddenException("Only completed booking can add reviews");
        if(booking.venueId !== createReviewDto.venueId) throw new BadRequestException("Venue does not matched");
        const review = this.reviewRepository.create({
            ...createReviewDto
        })
        await this.reviewRepository.save(review);
        return review;
    }
    // update review
    async updateReview( id: string, updateReviewDto: UpdateReviewDto ){
        const {comment, rating} = updateReviewDto;
        const review = await this.reviewRepository.findOne({where: {id}});
        if(!review) throw new NotFoundException(`review ${id} not found`)
        if(rating !== undefined) review.rating = rating;
        if(comment !== undefined) review.comment = comment;
        await this.reviewRepository.save(review);
        return review;
    }
    // delete review
    async deleteReview(id: string){
        const result = await this.reviewRepository.delete(id);
        if(result.affected === 0) throw new NotFoundException(`review ${id} not found`)
    }
}
