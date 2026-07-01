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
exports.Venue = void 0;
const typeorm_1 = require("typeorm");
const venue_enums_1 = require("../enums/venue.enums");
const user_entity_1 = require("../../users/user.entity");
const venue_category_entity_1 = require("./venue-category.entity");
const venue_amenity_entity_1 = require("./venue-amenity.entity");
let Venue = class Venue {
    id;
    owner;
    ownerId;
    name;
    description;
    address;
    district;
    photos;
    latitude;
    longitude;
    minCapacity;
    maxCapacity;
    tags;
    status;
    availableFrom;
    availableUntil;
    openingTime;
    closingTime;
    holidays;
    weekDayOff;
    slotDurationMinutes;
    pricePerSlot;
    bookingBufferMinutes;
    categories;
    amenities;
    createdAt;
};
exports.Venue = Venue;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Venue.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User),
    (0, typeorm_1.JoinColumn)({ name: "ownerId" }),
    __metadata("design:type", user_entity_1.User)
], Venue.prototype, "owner", void 0);
__decorate([
    (0, typeorm_1.Index)(),
    (0, typeorm_1.Column)("uuid"),
    __metadata("design:type", String)
], Venue.prototype, "ownerId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 100 }),
    __metadata("design:type", String)
], Venue.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 1000 }),
    __metadata("design:type", String)
], Venue.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 600 }),
    __metadata("design:type", String)
], Venue.prototype, "address", void 0);
__decorate([
    (0, typeorm_1.Index)(),
    (0, typeorm_1.Column)({
        type: "enum",
        enum: venue_enums_1.Districts,
    }),
    __metadata("design:type", String)
], Venue.prototype, "district", void 0);
__decorate([
    (0, typeorm_1.Column)("text", { array: true }),
    __metadata("design:type", Array)
], Venue.prototype, "photos", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'float', nullable: true }),
    __metadata("design:type", Number)
], Venue.prototype, "latitude", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'float', nullable: true }),
    __metadata("design:type", Number)
], Venue.prototype, "longitude", void 0);
__decorate([
    (0, typeorm_1.Column)("int"),
    __metadata("design:type", Number)
], Venue.prototype, "minCapacity", void 0);
__decorate([
    (0, typeorm_1.Column)("int"),
    __metadata("design:type", Number)
], Venue.prototype, "maxCapacity", void 0);
__decorate([
    (0, typeorm_1.Column)("text", { array: true, nullable: true }),
    __metadata("design:type", Array)
], Venue.prototype, "tags", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: "enum",
        enum: venue_enums_1.VenueStatus
    }),
    __metadata("design:type", String)
], Venue.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)("date"),
    __metadata("design:type", Date)
], Venue.prototype, "availableFrom", void 0);
__decorate([
    (0, typeorm_1.Column)("date"),
    __metadata("design:type", Date)
], Venue.prototype, "availableUntil", void 0);
__decorate([
    (0, typeorm_1.Column)("time"),
    __metadata("design:type", String)
], Venue.prototype, "openingTime", void 0);
__decorate([
    (0, typeorm_1.Column)("time"),
    __metadata("design:type", String)
], Venue.prototype, "closingTime", void 0);
__decorate([
    (0, typeorm_1.Column)("date", { array: true, nullable: true, default: [] }),
    __metadata("design:type", Array)
], Venue.prototype, "holidays", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: "enum",
        enum: venue_enums_1.WeekDays,
        array: true,
        nullable: true,
        default: []
    }),
    __metadata("design:type", Array)
], Venue.prototype, "weekDayOff", void 0);
__decorate([
    (0, typeorm_1.Column)("int"),
    __metadata("design:type", Number)
], Venue.prototype, "slotDurationMinutes", void 0);
__decorate([
    (0, typeorm_1.Column)("decimal", {
        precision: 10,
        scale: 2,
    }),
    __metadata("design:type", Number)
], Venue.prototype, "pricePerSlot", void 0);
__decorate([
    (0, typeorm_1.Column)("int"),
    __metadata("design:type", Number)
], Venue.prototype, "bookingBufferMinutes", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => venue_category_entity_1.VenueCategory),
    (0, typeorm_1.JoinTable)({ name: "venue_categories" }),
    __metadata("design:type", Array)
], Venue.prototype, "categories", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => venue_amenity_entity_1.VenueAmenity),
    (0, typeorm_1.JoinTable)({ name: "venue_amenities" }),
    __metadata("design:type", Array)
], Venue.prototype, "amenities", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Venue.prototype, "createdAt", void 0);
exports.Venue = Venue = __decorate([
    (0, typeorm_1.Entity)()
], Venue);
//# sourceMappingURL=venue.entity.js.map