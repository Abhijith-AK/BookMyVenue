import { ArrayMaxSize, ArrayNotEmpty, IsArray, IsDate, IsEnum, IsIn, IsNumber, IsOptional, IsString, IsUUID, Matches, MaxLength, Min } from "class-validator";
import { Districts, WeekDays } from "../enums/venue.enums";
import { Type } from "class-transformer";

export class UpdateVenueDto{
        @IsOptional()
        @IsString()
        @MaxLength(100)
        name?: string;
    
        @IsOptional()
        @IsString()
        @MaxLength(1000)
        description?: string;
    
        @IsOptional()
        @IsString()
        @MaxLength(600)
        address?: string;
    
        @IsOptional()
        @IsEnum(Districts)
        district?: Districts;
    
        @IsOptional()
        @Type(() => Number)
        @IsNumber()
        @Min(1)
        minCapacity?: number;
    
        @IsOptional()
        @Type(() => Number)
        @IsNumber()
        @Min(1)
        maxCapacity?: number;
    
        @IsOptional()
        @IsArray()
        @ArrayMaxSize(20)
        @IsString({each: true})
        @MaxLength(30, {each: true})
        tags?: string[];
    
        @IsOptional()
        @Type(() => Date)
        @IsDate()
        availableFrom?: Date;
    
        @IsOptional()
        @Type(() => Date)
        @IsDate()
        availableUntil?: Date;
    
        @IsOptional()
        @IsString()
        @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
        openingTime?: string;
    
        @IsOptional()
        @IsString()
        @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
        closingTime?: string;
    
        @IsOptional()
        @IsArray()
        @Type(() => Date)
        @IsDate({each: true})
        holidays?: Date[];
    
        @IsOptional()
        @IsArray()
        @IsEnum(WeekDays, {each: true})
        weekDayOff?: WeekDays[];
    
        @IsOptional()
        @Type(() => Number)
        @IsNumber()
        @IsIn([15, 30, 60])
        slotDurationMinutes?: number;
    
        @IsOptional()
        @Type(() => Number)
        @IsNumber()
        @Min(1)
        pricePerSlot?: number
    
        @IsOptional()
        @Type(() => Number)
        @IsNumber()
        @IsIn([0, 15, 30, 60, 120])
        bookingBufferMinutes?: number;

        @IsOptional()
        @IsArray()
        @ArrayNotEmpty()
        @IsUUID('4', {each: true})
        categoryIds!: string[];
        
        @IsOptional()
        @IsArray()
        @ArrayNotEmpty()
        @IsUUID('4', {each: true})
        amenityIds!: string[];
}