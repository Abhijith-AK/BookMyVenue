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
exports.OwnerController = void 0;
const common_1 = require("@nestjs/common");
const owner_service_1 = require("./owner.service");
let OwnerController = class OwnerController {
    ownerService;
    constructor(ownerService) {
        this.ownerService = ownerService;
    }
    async getDashboard(user) {
        return this.ownerService.getOwnerDashboard(user.ownerId);
    }
    async getRecentBookings(user) {
        return this.ownerService.getRecentBookings(user.ownerId);
    }
    async getRecentReviews(user) {
        return this.ownerService.getRecentReviews(user.ownerId);
    }
};
exports.OwnerController = OwnerController;
__decorate([
    (0, common_1.Get)('dashboard'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], OwnerController.prototype, "getDashboard", null);
__decorate([
    (0, common_1.Get)('recent-bookings'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], OwnerController.prototype, "getRecentBookings", null);
__decorate([
    (0, common_1.Get)('recent-reviews'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], OwnerController.prototype, "getRecentReviews", null);
exports.OwnerController = OwnerController = __decorate([
    (0, common_1.Controller)('owner'),
    __metadata("design:paramtypes", [owner_service_1.OwnerService])
], OwnerController);
//# sourceMappingURL=owner.controller.js.map