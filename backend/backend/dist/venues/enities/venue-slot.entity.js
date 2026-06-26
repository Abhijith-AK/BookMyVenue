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
exports.VenueSlot = void 0;
const typeorm_1 = require("typeorm");
const venue_entity_1 = require("./venue.entity");
const venue_enums_1 = require("../enums/venue.enums");
const booking_entity_1 = require("../../bookings/booking.entity");
let VenueSlot = class VenueSlot {
    id;
    venue;
    venueId;
    startAt;
    endAt;
    price;
    status;
    booking;
    bookingId;
};
exports.VenueSlot = VenueSlot;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)("uuid"),
    __metadata("design:type", String)
], VenueSlot.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => venue_entity_1.Venue, { onDelete: "CASCADE" }),
    (0, typeorm_1.JoinColumn)({ name: "venueId" }),
    __metadata("design:type", venue_entity_1.Venue)
], VenueSlot.prototype, "venue", void 0);
__decorate([
    (0, typeorm_1.Index)(),
    (0, typeorm_1.Column)("uuid"),
    __metadata("design:type", String)
], VenueSlot.prototype, "venueId", void 0);
__decorate([
    (0, typeorm_1.Column)("timestamp"),
    __metadata("design:type", Date)
], VenueSlot.prototype, "startAt", void 0);
__decorate([
    (0, typeorm_1.Column)("timestamp"),
    __metadata("design:type", Date)
], VenueSlot.prototype, "endAt", void 0);
__decorate([
    (0, typeorm_1.Column)("decimal", {
        precision: 10,
        scale: 2
    }),
    __metadata("design:type", Number)
], VenueSlot.prototype, "price", void 0);
__decorate([
    (0, typeorm_1.Index)(),
    (0, typeorm_1.Column)({
        type: "enum",
        enum: venue_enums_1.SlotStatus
    }),
    __metadata("design:type", String)
], VenueSlot.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => booking_entity_1.Booking, booking => booking.slots, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: "bookingId" }),
    __metadata("design:type", booking_entity_1.Booking)
], VenueSlot.prototype, "booking", void 0);
__decorate([
    (0, typeorm_1.Column)("uuid", { nullable: true }),
    __metadata("design:type", String)
], VenueSlot.prototype, "bookingId", void 0);
exports.VenueSlot = VenueSlot = __decorate([
    (0, typeorm_1.Entity)(),
    (0, typeorm_1.Unique)("UQ_VENUE_SLOT_START", ["venueId", "startAt"])
], VenueSlot);
//# sourceMappingURL=venue-slot.entity.js.map