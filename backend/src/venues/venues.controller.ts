import { BadRequestException, Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post, Query, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { VenuesService } from './venues.service';
import { GetVenueFilterDto } from './dto/get-venue-filter.dto';
import { CreateVenueCategoryDto } from './dto/create-category-venue.dto';
import { UpdateVenueCategoryDto } from './dto/update-category-venue.dto';
import { CreateVenueAmenityDto } from './dto/create-amenity-venue.dto';
import { UpdateVenueAmenityDto } from './dto/update-amenity-venue.dto';
import { CreateVenueServiceDto } from './dto/create-service-venue.dto';
import { UpdateVenueServiceDto } from './dto/update-service-venue.dto';
import { CreateVenueDto } from './dto/create-venue.dto';
import { UpdateVenueDto } from './dto/update-venue.dto';
import { GetVenueByIdDto } from './dto/get-venue-id.dto';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserRole } from 'src/users/user.enums';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import type { JwtUser } from 'src/auth/get-user.models';
import { FilesInterceptor } from '@nestjs/platform-express';
import type { Multer } from 'multer';

@Controller('venues')
export class VenuesController {
    constructor(private venueService: VenuesService){}

    @UseGuards(RolesGuard)
    @Roles(UserRole.ADMIN, UserRole.CUSTOMER)
    @Get()
    getAllVenues(@Query() query: GetVenueFilterDto){
            return this.venueService.getFilteredVenues(query); 
    }

    @UseGuards(RolesGuard)
    @Roles(UserRole.OWNER)
    @Get('/owner/:ownerId')
    getAllVenuesByOwner(@Param('ownerId', new ParseUUIDPipe()) ownerId: string){
        return this.venueService.getVenueForOwners(ownerId);
    }

    @UseGuards(RolesGuard)
    @Roles(UserRole.OWNER)
    @Post()
    @UseInterceptors(FilesInterceptor('images', 10, {
        limits: {
            fileSize: 10 * 1024 * 1024, // 10 MB
        },
        fileFilter: (req, file, cb) => {
            if (!file.mimetype.match(/^image\/(jpeg|jpg|png|webp)$/)) {
                return cb(
                    new BadRequestException(
                        "Only JPG, JPEG, PNG and WEBP images are allowed",
                    ),
                    false,
                );
            }

            cb(null, true);
        },
    }))
    createVenue(@GetUser() user: JwtUser, @UploadedFiles() files: Array<Express.Multer.File>,
                @Body() createVenueDto: CreateVenueDto){
        return this.venueService.createVenue(user.id, createVenueDto, files);
    }

    @UseGuards(RolesGuard)
    @Roles(UserRole.OWNER, UserRole.ADMIN)
    @Get("categories")
    getAllCategories(){
        return this.venueService.getAllCategories();
    }

    @UseGuards(RolesGuard)
    @Roles(UserRole.ADMIN)
    @Post("categories")
    createCategory(@Body() createCategoryDto: CreateVenueCategoryDto){
        return this.venueService.createCategory(createCategoryDto);
    }

    @UseGuards(RolesGuard)
    @Roles(UserRole.ADMIN)
    @Patch("categories/:id")
    updateCategory(@Param('id', new ParseUUIDPipe()) id: string, @Body() updateCategoryDto: UpdateVenueCategoryDto){
        return this.venueService.updateCategory(id, updateCategoryDto);
    }

    @UseGuards(RolesGuard)
    @Roles(UserRole.ADMIN)
    @Delete("categories/:id")
    deleteCategory(@Param('id', new ParseUUIDPipe()) id: string){
        return this.venueService.deleteCategory(id);
    }

    @UseGuards(RolesGuard)
    @Roles(UserRole.OWNER, UserRole.ADMIN)
    @Get("amenities")
    getAllAmenities(){
        return this.venueService.getAllAmenities();
    }

    @UseGuards(RolesGuard)
    @Roles(UserRole.ADMIN)
    @Post("amenities")
    createAmenity(@Body() createAmenityDto: CreateVenueAmenityDto){
        return this.venueService.createAmenity(createAmenityDto);
    }

    @UseGuards(RolesGuard)
    @Roles(UserRole.ADMIN)
    @Patch("amenities/:id")
    updateAmenity(@Param('id', new ParseUUIDPipe()) id: string, @Body() updateAmenityDto: UpdateVenueAmenityDto){
        return this.venueService.updateAmenity(id, updateAmenityDto);
    }

    @UseGuards(RolesGuard)
    @Roles(UserRole.ADMIN)
    @Delete("amenities/:id")
    deleteAmenity(@Param('id', new ParseUUIDPipe()) id: string){
        return this.venueService.deleteAmenity(id);
    }

    @UseGuards(RolesGuard)
    @Roles(UserRole.OWNER)
    @Get(":venueId/services")
    getAllServices(@Param('venueId', new ParseUUIDPipe()) id: string){
        return this.venueService.getAllServices(id);
    }

    @UseGuards(RolesGuard)
    @Roles(UserRole.OWNER)
    @Post(":venueId/services")
    createService(@Param('venueId', new ParseUUIDPipe()) venueId: string, @Body() createServiceDto: CreateVenueServiceDto){
        createServiceDto.venueId = venueId;
        return this.venueService.createService(createServiceDto);
    }

    @UseGuards(RolesGuard)
    @Roles(UserRole.OWNER)
    @Patch(":venueId/services/:id")
    updateService(@Param('id', new ParseUUIDPipe()) id: string, @Body() updateServiceDto: UpdateVenueServiceDto){
        return this.venueService.updateService(id, updateServiceDto);
    }

    @UseGuards(RolesGuard)
    @Roles(UserRole.OWNER)
    @Delete(":venueId/services/:id")
    deleteService(@Param('id', new ParseUUIDPipe()) id: string){
        return this.venueService.deleteService(id);
    }

    @Get(":id")
    getVenueById(@Param('id', new ParseUUIDPipe()) id: string, @Query() query: GetVenueByIdDto){
        return this.venueService.getVenueById(id, query);
    }

    @UseGuards(RolesGuard)
    @Roles(UserRole.OWNER, UserRole.ADMIN)
    @Patch(":id")
    updateVenue(@GetUser() user: JwtUser, @Param('id', new ParseUUIDPipe()) id: string, @Body() updatevenueDto: UpdateVenueDto){
        return this.venueService.updateVenue(user, id, updatevenueDto);
    }

    @UseGuards(RolesGuard)
    @Roles(UserRole.OWNER)
    @Patch(":id/photos")
    @UseInterceptors(FilesInterceptor('images', 10, {
        limits: {
            fileSize: 10 * 1024 * 1024, // 10 MB
        },
        fileFilter: (req, file, cb) => {
            if (!file.mimetype.match(/^image\/(jpeg|jpg|png|webp)$/)) {
                return cb(
                    new BadRequestException(
                        "Only JPG, JPEG, PNG and WEBP images are allowed",
                    ),
                    false,
                );
            }

            cb(null, true);
        },
    }))
    updateVenuePhotos(@GetUser() user: JwtUser, @Param('id', new ParseUUIDPipe()) id: string, @UploadedFiles() files: Express.Multer.File[],){
        return this.venueService.updateVenuePhotos(user, id, files);
    }

    @UseGuards(RolesGuard)
    @Roles(UserRole.OWNER, UserRole.ADMIN)
    @Delete(":id")
    deleteVenue(@GetUser() user: JwtUser, @Param('id', new ParseUUIDPipe()) id: string){
        return this.venueService.deleteVenue(user, id);
    }
}