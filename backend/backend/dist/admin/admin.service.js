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
exports.AdminService = void 0;
const common_1 = require("@nestjs/common");
const bookings_service_1 = require("../bookings/bookings.service");
const booking_enums_1 = require("../bookings/enums/booking.enums");
const reviews_service_1 = require("../reviews/reviews.service");
const user_enums_1 = require("../users/user.enums");
const users_service_1 = require("../users/users.service");
const venue_enums_1 = require("../venues/enums/venue.enums");
const venues_service_1 = require("../venues/venues.service");
let AdminService = class AdminService {
    venuesService;
    bookingsService;
    reviewsService;
    usersService;
    constructor(venuesService, bookingsService, reviewsService, usersService) {
        this.venuesService = venuesService;
        this.bookingsService = bookingsService;
        this.reviewsService = reviewsService;
        this.usersService = usersService;
    }
    async getAdminDashboard() {
        const users = await this.usersService.getAllUsers();
        const venues = await this.venuesService.getFilteredVenues({});
        const bookings = await this.bookingsService.getAllBookings();
        const totalVenues = venues.length;
        const totalOwners = users.filter(u => u.role === user_enums_1.UserRole.OWNER).length;
        const totalUsers = users.filter(u => u.role === user_enums_1.UserRole.CUSTOMER).length;
        const completedBookings = bookings.filter(b => b.status === booking_enums_1.BookingStatus.COMPLETED).length;
        const activeBookings = bookings.filter(b => b.status === booking_enums_1.BookingStatus.CONFIRMED).length;
        const cancelledBookings = bookings.filter(b => b.status === booking_enums_1.BookingStatus.CANCELLED).length;
        const totalRevenue = bookings.filter(b => b.status === booking_enums_1.BookingStatus.COMPLETED || b.status === booking_enums_1.BookingStatus.CONFIRMED)
            .reduce((total, b) => total + b.totalAmount, 0);
        const pendingVenueApprovals = venues.filter(v => v.status === venue_enums_1.VenueStatus.PENDING_APPROVAL).length;
        return {
            totalVenues,
            totalOwners,
            totalUsers,
            completedBookings,
            activeBookings,
            cancelledBookings,
            totalRevenue,
            pendingVenueApprovals,
        };
    }
    async getRecentBookings() {
        const bookings = await this.bookingsService.getAllBookings();
        return bookings
            .filter(b => b.status === booking_enums_1.BookingStatus.CONFIRMED)
            .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()).slice(0, 10);
    }
    async getRecentReviews() {
        const reviews = await this.reviewsService.getAllReviews();
        return reviews.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()).slice(0, 10);
    }
};
exports.AdminService = AdminService;
exports.AdminService = AdminService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [venues_service_1.VenuesService,
        bookings_service_1.BookingsService,
        reviews_service_1.ReviewsService,
        users_service_1.UsersService])
], AdminService);
//# sourceMappingURL=admin.service.js.map