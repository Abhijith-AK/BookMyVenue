import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserRole } from 'src/users/user.enums';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import type { JwtUser } from 'src/auth/get-user.models';

@Controller('reviews')
export class ReviewsController {
    constructor(private reviewsService: ReviewsService){}
    // get all reviews
    @UseGuards(RolesGuard)
    @Roles(UserRole.ADMIN)
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
    @UseGuards(RolesGuard)
    @Roles(UserRole.CUSTOMER)
    @Get('booking/:id')
    async getReviewByBooking(@Param('id', new ParseUUIDPipe()) id: string){
        return this.reviewsService.getReviewByBooking(id);
    }
    // create review
    @UseGuards(RolesGuard)
    @Roles(UserRole.CUSTOMER)
    @Post()
    async createReview(@GetUser() user: JwtUser, @Body() createReviewDto: CreateReviewDto){
        return this.reviewsService.createReview(user.id, createReviewDto);
    }
    // update review
    @UseGuards(RolesGuard)
    @Roles(UserRole.CUSTOMER)
    @Patch(':id')
    async updateReview(@GetUser() user: JwtUser, @Param('id', new ParseUUIDPipe()) id: string, @Body() updateReviewDto: UpdateReviewDto){
        return this.reviewsService.updateReview(user.id, id, updateReviewDto);
    }
    // delete review
    @UseGuards(RolesGuard)
    @Roles(UserRole.CUSTOMER, UserRole.ADMIN)
    @Delete(':id')
    async deleteReview(@GetUser() user: JwtUser, @Param('id', new ParseUUIDPipe()) id: string){
        return this.reviewsService.deleteReview(user, id);
    }
}
