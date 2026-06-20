import { Type } from "class-transformer";
import { IsNotEmpty, IsNumber, IsString, IsUUID, MaxLength, Min } from "class-validator";

export class CreateVenueServiceDto{
    @IsNotEmpty()
    @IsUUID('4')
    venueId!: string;

    @IsNotEmpty()
    @IsString()
    @MaxLength(50)
    name!: string

    @IsNotEmpty()
    @Type(() => Number)
    @IsNumber()
    @Min(0)
    price!: number 
}