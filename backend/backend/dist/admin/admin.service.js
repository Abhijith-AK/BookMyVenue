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
exports.AdminService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const booking_entity_1 = require("../bookings/booking.entity");
const bookings_service_1 = require("../bookings/bookings.service");
const booking_enums_1 = require("../bookings/enums/booking.enums");
const review_entity_1 = require("../reviews/review.entity");
const user_enums_1 = require("../users/user.enums");
const users_service_1 = require("../users/users.service");
const venue_enums_1 = require("../venues/enums/venue.enums");
const venues_service_1 = require("../venues/venues.service");
const typeorm_2 = require("typeorm");
let AdminService = class AdminService {
    bookingRepository;
    reviewRepository;
    venuesService;
    bookingsService;
    usersService;
    constructor(bookingRepository, reviewRepository, venuesService, bookingsService, usersService) {
        this.bookingRepository = bookingRepository;
        this.reviewRepository = reviewRepository;
        this.venuesService = venuesService;
        this.bookingsService = bookingsService;
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
        return await this.bookingRepository.createQueryBuilder("booking")
            .where("booking.status = :status", { status: booking_enums_1.BookingStatus.CONFIRMED })
            .orderBy("booking.createdAt", "DESC")
            .take(10)
            .getMany();
    }
    async getRecentReviews() {
        return await this.reviewRepository.createQueryBuilder("review")
            .orderBy("review.createdAt", "DESC")
            .take(10)
            .getMany();
    }
};
exports.AdminService = AdminService;
exports.AdminService = AdminService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(booking_entity_1.Booking)),
    __param(1, (0, typeorm_1.InjectRepository)(review_entity_1.Review)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        venues_service_1.VenuesService,
        bookings_service_1.BookingsService,
        users_service_1.UsersService])
], AdminService);
//# sourceMappingURL=admin.service.js.map