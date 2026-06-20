import { IsBoolean, IsOptional, IsString, IsUUID, MaxLength } from "class-validator";

export class UpdateVenueCategoryDto{
    @IsOptional()
    @IsString()
    @MaxLength(50)
    name!: string

    @IsOptional()
    @IsBoolean()
    isActive!: boolean 
}