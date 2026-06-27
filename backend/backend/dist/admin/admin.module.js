"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminModule = void 0;
const common_1 = require("@nestjs/common");
const admin_controller_1 = require("./admin.controller");
const admin_service_1 = require("./admin.service");
const reviews_module_1 = require("../reviews/reviews.module");
const bookings_module_1 = require("../bookings/bookings.module");
const venues_module_1 = require("../venues/venues.module");
const users_module_1 = require("../users/users.module");
const typeorm_1 = require("@nestjs/typeorm");
const booking_entity_1 = require("../bookings/booking.entity");
const review_entity_1 = require("../reviews/review.entity");
let AdminModule = class AdminModule {
};
exports.AdminModule = AdminModule;
exports.AdminModule = AdminModule = __decorate([
    (0, common_1.Module)({
        imports: [venues_module_1.VenuesModule, bookings_module_1.BookingsModule, reviews_module_1.ReviewsModule, users_module_1.UsersModule,
            typeorm_1.TypeOrmModule.forFeature([booking_entity_1.Booking, review_entity_1.Review])
        ],
        controllers: [admin_controller_1.AdminController],
        providers: [admin_service_1.AdminService]
    })
], AdminModule);
//# sourceMappingURL=admin.module.js.map