import { IsDateString, IsEnum, IsNumber, IsOptional, IsString, Min } from "class-validator";
import { Districts } from "../enums/venue.enums";
import { Type } from "class-transformer";

export class GetVenueFilterDto{
    @IsOptional()
    @IsString()
    search?: string

    @IsOptional()
    @IsEnum(Districts)
    district?: Districts;

    @IsOptional()
    @IsString()
    category?: string;

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @Min(1)
    price?: number

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @Min(1)
    capacity?: number

    @IsOptional()
    @IsDateString()
    date?: Date
}