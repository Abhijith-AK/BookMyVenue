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
Object.defineProperty(exports, "__esModule", { value: true });
exports.OwnerService = void 0;
const common_1 = require("@nestjs/common");
const bookings_service_1 = require("../bookings/bookings.service");
const booking_enums_1 = require("../bookings/enums/booking.enums");
const reviews_service_1 = require("../reviews/reviews.service");
const venues_service_1 = require("../venues/venues.service");
let OwnerService = class OwnerService {
    venuesService;
    bookingsService;
    reviewsService;
    constructor(venuesService, bookingsService, reviewsService) {
        this.venuesService = venuesService;
        this.bookingsService = bookingsService;
        this.reviewsService = reviewsService;
    }
    async getOwnerDashboard(ownerId) {
        const venues = await this.venuesService.getVenueForOwners(ownerId);
        const bookings = await this.bookingsService.getBookingByOwner(ownerId);
        const reviews = await this.reviewsService.getReviewsForOwner(ownerId);
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
        const bookings = await this.bookingsService.getBookingByOwner(ownerId);
        return bookings.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()).splice(0, 10);
    }
    async getRecentReviews(ownerId) {
        const reviews = await this.reviewsService.getReviewsForOwner(ownerId);
        return reviews.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()).splice(0, 10);
    }
};
exports.OwnerService = OwnerService;
exports.OwnerService = OwnerService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [venues_service_1.VenuesService,
        bookings_service_1.BookingsService,
        reviews_service_1.ReviewsService])
], OwnerService);
//# sourceMappingURL=owner.service.js.map