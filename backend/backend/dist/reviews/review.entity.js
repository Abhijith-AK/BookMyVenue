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
exports.Review = void 0;
const typeorm_1 = require("typeorm");
let Review = class Review {
    id;
    bookingId;
    venueId;
    customerId;
    rating;
    comment;
    createdAt;
};
exports.Review = Review;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)("uuid"),
    __metadata("design:type", String)
], Review.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)("uuid"),
    __metadata("design:type", String)
], Review.prototype, "bookingId", void 0);
__decorate([
    (0, typeorm_1.Column)("uuid"),
    __metadata("design:type", String)
], Review.prototype, "venueId", void 0);
__decorate([
    (0, typeorm_1.Column)("uuid"),
    __metadata("design:type", String)
], Review.prototype, "customerId", void 0);
__decorate([
    (0, typeorm_1.Column)("int"),
    __metadata("design:type", Number)
], Review.prototype, "rating", void 0);
__decorate([
    (0, typeorm_1.Column)("text", { nullable: true }),
    __metadata("design:type", String)
], Review.prototype, "comment", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Review.prototype, "createdAt", void 0);
exports.Review = Review = __decorate([
    (0, typeorm_1.Entity)(),
    (0, typeorm_1.Unique)(["bookingId"])
], Review);
//# sourceMappingURL=review.entity.js.map