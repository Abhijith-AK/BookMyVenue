import { IsBoolean, IsNotEmpty, IsString, IsUUID, MaxLength } from "class-validator";

export class CreateVenueAmenityDto{
    @IsNotEmpty()
    @IsString()
    @MaxLength(50)
    name!: string

    @IsNotEmpty()
    @IsBoolean()
    isActive!: boolean 
}