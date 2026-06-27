"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VenuesModule = void 0;
const common_1 = require("@nestjs/common");
const venues_controller_1 = require("./venues.controller");
const venues_service_1 = require("./venues.service");
const typeorm_1 = require("@nestjs/typeorm");
const venue_entity_1 = require("./enities/venue.entity");
const venue_amenity_entity_1 = require("./enities/venue-amenity.entity");
const venue_category_entity_1 = require("./enities/venue-category.entity");
const venue_service_entity_1 = require("./enities/venue-service.entity");
const venue_slot_entity_1 = require("./enities/venue-slot.entity");
const cloudinary_module_1 = require("../cloudinary/cloudinary.module");
let VenuesModule = class VenuesModule {
};
exports.VenuesModule = VenuesModule;
exports.VenuesModule = VenuesModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([venue_entity_1.Venue, venue_amenity_entity_1.VenueAmenity, venue_category_entity_1.VenueCategory, venue_service_entity_1.VenueService, venue_slot_entity_1.VenueSlot]), cloudinary_module_1.CloudinaryModule],
        controllers: [venues_controller_1.VenuesController],
        providers: [venues_service_1.VenuesService],
        exports: [venues_service_1.VenuesService]
    })
], VenuesModule);
//# sourceMappingURL=venues.module.js.map