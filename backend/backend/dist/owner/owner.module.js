"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OwnerModule = void 0;
const common_1 = require("@nestjs/common");
const owner_controller_1 = require("./owner.controller");
const owner_service_1 = require("./owner.service");
const venues_module_1 = require("../venues/venues.module");
const bookings_module_1 = require("../bookings/bookings.module");
const reviews_module_1 = require("../reviews/reviews.module");
const typeorm_1 = require("@nestjs/typeorm");
const review_entity_1 = require("../reviews/review.entity");
const booking_entity_1 = require("../bookings/booking.entity");
const venue_entity_1 = require("../venues/enities/venue.entity");
const user_entity_1 = require("../users/user.entity");
let OwnerModule = class OwnerModule {
};
exports.OwnerModule = OwnerModule;
exports.OwnerModule = OwnerModule = __decorate([
    (0, common_1.Module)({
        imports: [venues_module_1.VenuesModule, bookings_module_1.BookingsModule, reviews_module_1.ReviewsModule,
            typeorm_1.TypeOrmModule.forFeature([review_entity_1.Review, booking_entity_1.Booking, venue_entity_1.Venue, user_entity_1.User])
        ],
        controllers: [owner_controller_1.OwnerController],
        providers: [owner_service_1.OwnerService]
    })
], OwnerModule);
//# sourceMappingURL=owner.module.js.map