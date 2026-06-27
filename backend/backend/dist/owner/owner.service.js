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
exports.OwnerService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const booking_entity_1 = require("../bookings/booking.entity");
const booking_enums_1 = require("../bookings/enums/booking.enums");
const review_entity_1 = require("../reviews/review.entity");
const reviews_service_1 = require("../reviews/reviews.service");
const user_entity_1 = require("../users/user.entity");
const venue_entity_1 = require("../venues/enities/venue.entity");
const typeorm_2 = require("typeorm");
let OwnerService = class OwnerService {
    venueRepository;
    bookingRepository;
    reviewRepository;
    reviewService;
    constructor(venueRepository, bookingRepository, reviewRepository, reviewService) {
        this.venueRepository = venueRepository;
        this.bookingRepository = bookingRepository;
        this.reviewRepository = reviewRepository;
        this.reviewService = reviewService;
    }
    async getOwnerDashboard(ownerId) {
        const venues = await this.venueRepository.find({ where: { ownerId } });
        const bookings = await this.bookingRepository.createQueryBuilder("booking").leftJoinAndSelect("booking.venue", "venue")
            .where("venue.ownerId = :ownerId", { ownerId }).getMany();
        const reviews = await this.reviewService.getReviewsForOwner(ownerId);
        const totalVenues = venues.length;
        const totalBookings = bookings.length;
        const completedBookings = bookings.filter(b => b.status === booking_enums_1.BookingStatus.COMPLETED).length;
        const confirmedBookings = bookings.filter(b => b.status === booking_enums_1.BookingStatus.CONFIRMED).length;
        const cancelledBookings = bookings.filter(b => b.status === booking_enums_1.BookingStatus.CANCELLED).length;
        const totalRevenue = bookings.filter(b => b.status === booking_enums_1.BookingStatus.COMPLETED || b.status === booking_enums_1.BookingStatus.CONFIRMED)
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
        };
    }
    async getRecentBookings(ownerId) {
        const bookings = await this.bookingRepository.createQueryBuilder("booking").leftJoinAndSelect("booking.venue", "venue")
            .where("venue.ownerId = :ownerId", { ownerId })
            .orderBy("booking.createdAt", "DESC")
            .take(10)
            .getMany();
        return bookings;
    }
    async getRecentReviews(ownerId) {
        const reviews = await this.reviewRepository.createQueryBuilder("review")
            .leftJoin(user_entity_1.User, "customer", "customer.id = review.customerId")
            .innerJoin(venue_entity_1.Venue, "venue", "venue.id = review.venueId AND venue.ownerId = :ownerId", { ownerId })
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
};
exports.OwnerService = OwnerService;
exports.OwnerService = OwnerService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(venue_entity_1.Venue)),
    __param(1, (0, typeorm_1.InjectRepository)(booking_entity_1.Booking)),
    __param(2, (0, typeorm_1.InjectRepository)(review_entity_1.Review)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        reviews_service_1.ReviewsService])
], OwnerService);
//# sourceMappingURL=owner.service.js.map