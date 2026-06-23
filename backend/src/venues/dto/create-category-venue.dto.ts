import { Type } from "class-transformer";
import { IsBoolean, IsNotEmpty, IsString, IsUUID, MaxLength } from "class-validator";

export class CreateVenueCategoryDto{
    @IsNotEmpty()
    @IsString()
    @MaxLength(50)
    name!: string

    @IsNotEmpty()
    @Type(() => Boolean)
    @IsBoolean()
    isActive!: boolean 
}