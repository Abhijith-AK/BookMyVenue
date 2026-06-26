"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const review_entity_1 = require("./review.entity");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("../users/user.entity");
const booking_entity_1 = require("../bookings/booking.entity");
const bookings_service_1 = require("../bookings/bookings.service");
const booking_enums_1 = require("../bookings/enums/booking.enums");
const venue_entity_1 = require("../venues/enities/venue.entity");
let ReviewsService = class ReviewsService {
    reviewRepository;
    bookingsService;
    constructor(reviewRepository, bookingsService) {
        this.reviewRepository = reviewRepository;
        this.bookingsService = bookingsService;
    }
    async getAllReviews() {
        return await this.reviewRepository.find();
    }
    async getReviewsByVenue(venueId) {
        const reviews = await this.reviewRepository.createQueryBuilder("review")
            .leftJoin(user_entity_1.User, "customer", "customer.id = review.customerId")
            .leftJoin(booking_entity_1.Booking, "booking", "booking.id = review.bookingId")
            .select("review")
            .addSelect("customer.name", "customerName")
            .addSelect("booking.status", "bookingStatus")
            .where("review.venueId = :venueId", { venueId })
            .getRawMany();
        ;
        if (!reviews.length)
            throw new common_1.NotFoundException(`No reviews found for Venue-${venueId}`);
        return reviews;
    }
    async getReviewByBooking(bookingId) {
        const review = await this.reviewRepository.findOne({ where: { bookingId } });
        if (!review)
            throw new common_1.NotFoundException(`review not found for ${bookingId}`);
        return review;
    }
    async createReview(createReviewDto) {
        const existing = await this.reviewRepository.findOne({ where: { bookingId: createReviewDto.bookingId } });
        if (existing)
            throw new common_1.BadRequestException(`review already exists for booking ${createReviewDto.bookingId}`);
        const booking = await this.bookingsService.getBookingById(createReviewDto.bookingId);
        if (booking.status !== booking_enums_1.BookingStatus.COMPLETED)
            throw new common_1.ForbiddenException("Only completed booking can add reviews");
        if (booking.venueId !== createReviewDto.venueId)
            throw new common_1.BadRequestException("Venue does not matched");
        const review = this.reviewRepository.create({
            ...createReviewDto
        });
        await this.reviewRepository.save(review);
        return review;
    }
    async updateReview(id, updateReviewDto) {
        const { comment, rating } = updateReviewDto;
        const review = await this.reviewRepository.findOne({ where: { id } });
        if (!review)
            throw new common_1.NotFoundException(`review ${id} not found`);
        if (rating !== undefined)
            review.rating = rating;
        if (comment !== undefined)
            review.comment = comment;
        await this.reviewRepository.save(review);
        return review;
    }
    async deleteReview(id) {
        const result = await this.reviewRepository.delete(id);
        if (result.affected === 0)
            throw new common_1.NotFoundException(`review ${id} not found`);
    }
    async getReviewsForOwner(ownerId) {
        const reviews = await this.reviewRepository.createQueryBuilder("review")
            .leftJoin(user_entity_1.User, "customer", "customer.id = review.customerId")
            .innerJoin(venue_entity_1.Venue, "venue", "venue.id = review.venueId AND venue.ownerId = :ownerId", { ownerId })
            .select("review")
            .addSelect("venue.id", "venueId")
            .addSelect("venue.name", "venueName")
            .addSelect("customer.name", "customerName")
            .getRawMany();
        return reviews;
    }
};
exports.ReviewsService = ReviewsService;
exports.ReviewsService = ReviewsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(review_entity_1.Review)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        bookings_service_1.BookingsService])
], ReviewsService);
//# sourceMappingURL=reviews.service.js.map