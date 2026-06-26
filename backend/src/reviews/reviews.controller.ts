import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { Review } from './review.entity';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';

@Controller('reviews')
export class ReviewsController {
    constructor(private reviewsService: ReviewsService){}
    // get all reviews
    @Get()
    async getAllReviews(){
        return this.reviewsService.getAllReviews()
    }
    // get reviews by venue
    @Get('venue/:id')
    async getReviewsByVenue(@Param('id', new ParseUUIDPipe()) id: string){
        return this.reviewsService.getReviewsByVenue(id);
    }
    // get review by booking
    @Get('booking/:id')
    async getReviewByBooking(@Param('id', new ParseUUIDPipe()) id: string){
        return this.reviewsService.getReviewByBooking(id);
    }
    // create review
    @Post()
    async createReview(@Body() createReviewDto: CreateReviewDto){
        return this.reviewsService.createReview(createReviewDto);
    }
    // update review
    @Patch(':id')
    async updateReview(@Param('id', new ParseUUIDPipe()) id: string, @Body() updateReviewDto: UpdateReviewDto){
        return this.reviewsService.updateReview(id, updateReviewDto);
    }
    // delete review
    @Delete(':id')
    async deleteReview(@Param('id', new ParseUUIDPipe()) id: string){
        return this.reviewsService.deleteReview(id);
    }
}
