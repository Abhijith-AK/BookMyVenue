import { ArrayMaxSize, ArrayNotEmpty, IsArray, IsDate, IsEnum, IsIn, IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID, Matches, Max, MaxLength, Min } from "class-validator";
import { Districts, WeekDays } from "../models/venue.model";
import { Type } from "class-transformer";

export class CreateVenueDto {
    @IsNotEmpty()
    @IsString()
    @MaxLength(100)
    name!: string;

    @IsNotEmpty()
    @IsString()
    @MaxLength(1000)
    description!: string;

    @IsNotEmpty()
    @IsString()
    @MaxLength(600)
    address!: string;

    @IsNotEmpty()
    @IsEnum(Districts)
    district!: Districts;

    @IsNotEmpty()
    @IsArray()
    @ArrayNotEmpty()
    @ArrayMaxSize(20)
    @IsString({each: true})
    photos!: string[];

    @IsNotEmpty()
    @Type(() => Number)
    @IsNumber()
    @Min(1)
    minCapacity!: number;

    @IsNotEmpty()
    @Type(() => Number)
    @IsNumber()
    @Min(1)
    maxCapacity!: number;

    @IsOptional()
    @IsArray()
    @ArrayMaxSize(20)
    @IsString({each: true})
    @MaxLength(30, {each: true})
    tags?: string[];

    @IsNotEmpty()
    @Type(() => Date)
    @IsDate()
    availableFrom!: Date;

    @IsNotEmpty()
    @Type(() => Date)
    @IsDate()
    availableUntil!: Date;

    @IsNotEmpty()
    @IsString()
    @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
    openingTime!: string;

    @IsNotEmpty()
    @IsString()
    @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
    closingTime!: string;

    @IsOptional()
    @IsArray()
    @Type(() => Date)
    @IsDate({each: true})
    holidays?: Date[];

    @IsOptional()
    @IsArray()
    @IsEnum(WeekDays, {each: true})
    weekDayOff?: WeekDays[];

    @IsNotEmpty()
    @Type(() => Number)
    @IsNumber()
    @IsIn([15, 30, 60])
    slotDurationMinutes!: number;

    @IsNotEmpty()
    @Type(() => Number)
    @IsNumber()
    @Min(1)
    pricePerSlot!: number

    @IsNotEmpty()
    @Type(() => Number)
    @IsNumber()
    @IsIn([0, 15, 30, 60, 120])
    bookingBufferMinutes!: number;

    @IsNotEmpty()
    @IsUUID('4')
    ownerId!: string;

    @IsNotEmpty()
    @IsArray()
    @ArrayNotEmpty()
    @IsUUID('4', {each: true})
    categoryIds!: string[];

    @IsNotEmpty()
    @IsArray()
    @ArrayNotEmpty()
    @IsUUID('4', {each: true})
    amenityIds!: string[];
}