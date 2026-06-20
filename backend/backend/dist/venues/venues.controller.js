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
exports.VenuesController = void 0;
const common_1 = require("@nestjs/common");
const venues_service_1 = require("./venues.service");
const get_venue_filter_dto_1 = require("./dto/get-venue-filter.dto");
const create_category_venue_dto_1 = require("./dto/create-category-venue.dto");
const update_category_venue_dto_1 = require("./dto/update-category-venue.dto");
const create_amenity_venue_dto_1 = require("./dto/create-amenity-venue.dto");
const update_amenity_venue_dto_1 = require("./dto/update-amenity-venue.dto");
const create_service_venue_dto_1 = require("./dto/create-service-venue.dto");
const update_service_venue_dto_1 = require("./dto/update-service-venue.dto");
const create_venue_dto_1 = require("./dto/create-venue.dto");
const update_venue_dto_1 = require("./dto/update-venue.dto");
let VenuesController = class VenuesController {
    venueService;
    constructor(venueService) {
        this.venueService = venueService;
    }
    getAllVenues(query) {
        return this.venueService.getFilteredVenues(query);
    }
    getAllVenuesByOwner(ownerId) {
        return this.venueService.getVenueForOwners(ownerId);
    }
    createVenue(createVenueDto) {
        return this.venueService.createVenue(createVenueDto);
    }
    getAllCategories() {
        return this.venueService.getAllCategories();
    }
    createCategory(createCategoryDto) {
        return this.venueService.createCategory(createCategoryDto);
    }
    updateCategory(id, updateCategoryDto) {
        return this.venueService.updateCategory(id, updateCategoryDto);
    }
    deleteCategory(id) {
        return this.venueService.deleteCategory(id);
    }
    getAllAmenities() {
        return this.venueService.getAllAmenities();
    }
    createAmenity(createAmenityDto) {
        return this.venueService.createAmenity(createAmenityDto);
    }
    updateAmenity(id, updateAmenityDto) {
        return this.venueService.updateAmenity(id, updateAmenityDto);
    }
    deleteAmenity(id) {
        return this.venueService.deleteAmenity(id);
    }
    getAllServices(id) {
        return this.venueService.getAllServices(id);
    }
    createService(venueId, createServiceDto) {
        createServiceDto.venueId = venueId;
        return this.venueService.createService(createServiceDto);
    }
    updateService(id, updateServiceDto) {
        return this.venueService.updateService(id, updateServiceDto);
    }
    deleteService(id) {
        return this.venueService.deleteService(id);
    }
    getVenueById(id) {
        return this.venueService.getVenueById(id);
    }
    updateVenue(id, updatevenueDto) {
        return this.venueService.updateVenue(id, updatevenueDto);
    }
    deleteVenue(id) {
        return this.venueService.deleteVenue(id);
    }
};
exports.VenuesController = VenuesController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [get_venue_filter_dto_1.GetVenueFilterDto]),
    __metadata("design:returntype", void 0)
], VenuesController.prototype, "getAllVenues", null);
__decorate([
    (0, common_1.Get)('/owner/:ownerId'),
    __param(0, (0, common_1.Param)('ownerId', new common_1.ParseUUIDPipe())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], VenuesController.prototype, "getAllVenuesByOwner", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_venue_dto_1.CreateVenueDto]),
    __metadata("design:returntype", void 0)
], VenuesController.prototype, "createVenue", null);
__decorate([
    (0, common_1.Get)("categories"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], VenuesController.prototype, "getAllCategories", null);
__decorate([
    (0, common_1.Post)("categories"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_category_venue_dto_1.CreateVenueCategoryDto]),
    __metadata("design:returntype", void 0)
], VenuesController.prototype, "createCategory", null);
__decorate([
    (0, common_1.Patch)("categories/:id"),
    __param(0, (0, common_1.Param)('id', new common_1.ParseUUIDPipe())),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_category_venue_dto_1.UpdateVenueCategoryDto]),
    __metadata("design:returntype", void 0)
], VenuesController.prototype, "updateCategory", null);
__decorate([
    (0, common_1.Delete)("categories/:id"),
    __param(0, (0, common_1.Param)('id', new common_1.ParseUUIDPipe())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], VenuesController.prototype, "deleteCategory", null);
__decorate([
    (0, common_1.Get)("amenities"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], VenuesController.prototype, "getAllAmenities", null);
__decorate([
    (0, common_1.Post)("amenities"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_amenity_venue_dto_1.CreateVenueAmenityDto]),
    __metadata("design:returntype", void 0)
], VenuesController.prototype, "createAmenity", null);
__decorate([
    (0, common_1.Patch)("amenities/:id"),
    __param(0, (0, common_1.Param)('id', new common_1.ParseUUIDPipe())),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_amenity_venue_dto_1.UpdateVenueAmenityDto]),
    __metadata("design:returntype", void 0)
], VenuesController.prototype, "updateAmenity", null);
__decorate([
    (0, common_1.Delete)("amenities/:id"),
    __param(0, (0, common_1.Param)('id', new common_1.ParseUUIDPipe())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], VenuesController.prototype, "deleteAmenity", null);
__decorate([
    (0, common_1.Get)(":venueId/services"),
    __param(0, (0, common_1.Param)('venueId', new common_1.ParseUUIDPipe())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], VenuesController.prototype, "getAllServices", null);
__decorate([
    (0, common_1.Post)(":venueId/services"),
    __param(0, (0, common_1.Param)('venueId', new common_1.ParseUUIDPipe())),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_service_venue_dto_1.CreateVenueServiceDto]),
    __metadata("design:returntype", void 0)
], VenuesController.prototype, "createService", null);
__decorate([
    (0, common_1.Patch)(":venueId/services/:id"),
    __param(0, (0, common_1.Param)('id', new common_1.ParseUUIDPipe())),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_service_venue_dto_1.UpdateVenueServiceDto]),
    __metadata("design:returntype", void 0)
], VenuesController.prototype, "updateService", null);
__decorate([
    (0, common_1.Delete)(":venueId/services/:id"),
    __param(0, (0, common_1.Param)('id', new common_1.ParseUUIDPipe())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], VenuesController.prototype, "deleteService", null);
__decorate([
    (0, common_1.Get)(":id"),
    __param(0, (0, common_1.Param)('id', new common_1.ParseUUIDPipe())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], VenuesController.prototype, "getVenueById", null);
__decorate([
    (0, common_1.Patch)(":id"),
    __param(0, (0, common_1.Param)('id', new common_1.ParseUUIDPipe())),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_venue_dto_1.UpdateVenueDto]),
    __metadata("design:returntype", void 0)
], VenuesController.prototype, "updateVenue", null);
__decorate([
    (0, common_1.Delete)(":id"),
    __param(0, (0, common_1.Param)('id', new common_1.ParseUUIDPipe())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], VenuesController.prototype, "deleteVenue", null);
exports.VenuesController = VenuesController = __decorate([
    (0, common_1.Controller)('venues'),
    __metadata("design:paramtypes", [venues_service_1.VenuesService])
], VenuesController);
//# sourceMappingURL=venues.controller.js.map