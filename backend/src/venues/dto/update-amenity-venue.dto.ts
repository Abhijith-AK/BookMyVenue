import { IsBoolean, IsOptional, IsString, IsUUID, MaxLength } from "class-validator";

export class UpdateVenueAmenityDto{
    @IsOptional()
    @IsString()
    @MaxLength(50)
    name!: string

    @IsOptional()
    @IsBoolean()
    isActive!: boolean 
}