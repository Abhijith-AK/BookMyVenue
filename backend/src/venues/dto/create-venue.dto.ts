import { ArrayMaxSize, ArrayNotEmpty, IsArray, IsDate, IsEnum, IsIn, IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID, Matches, Max, MaxLength, Min } from "class-validator";
import { Districts, WeekDays } from "../enums/venue.enums";
import { Transform, Type } from "class-transformer";

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

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    latitude?: number;

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    longitude?: number;


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
    @Transform((({value}) => Array.isArray(value) ? value : value ? [value] : []))
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
    @Transform((({value}) => Array.isArray(value) ? value : value ? [value] : []))
    @IsArray()
    @ArrayNotEmpty()
    @IsUUID('4', {each: true})
    categoryIds!: string[];

    @IsNotEmpty()
    @Transform((({value}) => Array.isArray(value) ? value : value ? [value] : []))
    @IsArray()
    @ArrayNotEmpty()
    @IsUUID('4', {each: true})
    amenityIds!: string[];
}