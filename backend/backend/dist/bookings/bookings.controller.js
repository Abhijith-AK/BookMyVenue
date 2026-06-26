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
exports.BookingsController = void 0;
const common_1 = require("@nestjs/common");
const bookings_service_1 = require("./bookings.service");
const create_booking_dto_1 = require("./dto/create-booking.dto");
const create_quote_booking_dto_1 = require("./dto/create-quote-booking.dto");
const cancel_bookin_dto_1 = require("./dto/cancel-bookin.dto");
let BookingsController = class BookingsController {
    bookingsService;
    constructor(bookingsService) {
        this.bookingsService = bookingsService;
    }
    async getAllBookings() {
        return this.bookingsService.getAllBookings();
    }
    async createBooking(createBookingDto) {
        return this.bookingsService.createBooking(createBookingDto);
    }
    async createBookingQuote(createbookingQuoteDto) {
        return this.bookingsService.createBookingQuote(createbookingQuoteDto);
    }
    async cancelBooking(id, cancelBookingDto) {
        return this.bookingsService.cancelBooking(id, cancelBookingDto.reason);
    }
    async getBookingsByCustomer(customerId) {
        return this.bookingsService.getBookingByCustomer(customerId);
    }
    async getBookingsByOwner(ownerId) {
        return this.bookingsService.getBookingByOwner(ownerId);
    }
    async getBookingById(id) {
        return this.bookingsService.getBookingById(id);
    }
};
exports.BookingsController = BookingsController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], BookingsController.prototype, "getAllBookings", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_booking_dto_1.CreateBookingDto]),
    __metadata("design:returntype", Promise)
], BookingsController.prototype, "createBooking", null);
__decorate([
    (0, common_1.Post)("quote"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_quote_booking_dto_1.CreateQuoteBookingDto]),
    __metadata("design:returntype", Promise)
], BookingsController.prototype, "createBookingQuote", null);
__decorate([
    (0, common_1.Patch)(":id/cancel"),
    __param(0, (0, common_1.Param)('id', new common_1.ParseUUIDPipe())),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, cancel_bookin_dto_1.CancelBookingDto]),
    __metadata("design:returntype", Promise)
], BookingsController.prototype, "cancelBooking", null);
__decorate([
    (0, common_1.Get)("customer/:customerId"),
    __param(0, (0, common_1.Param)('customerId', new common_1.ParseUUIDPipe())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BookingsController.prototype, "getBookingsByCustomer", null);
__decorate([
    (0, common_1.Get)("owner/:ownerId"),
    __param(0, (0, common_1.Param)('ownerId', new common_1.ParseUUIDPipe())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BookingsController.prototype, "getBookingsByOwner", null);
__decorate([
    (0, common_1.Get)(":id"),
    __param(0, (0, common_1.Param)('id', new common_1.ParseUUIDPipe())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BookingsController.prototype, "getBookingById", null);
exports.BookingsController = BookingsController = __decorate([
    (0, common_1.Controller)('bookings'),
    __metadata("design:paramtypes", [bookings_service_1.BookingsService])
], BookingsController);
//# sourceMappingURL=bookings.controller.js.map