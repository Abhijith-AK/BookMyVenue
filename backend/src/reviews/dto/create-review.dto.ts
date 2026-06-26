import { Transform } from "class-transformer";
import { IsInt, IsNotEmpty, IsOptional, IsString, IsUUID, Max, MaxLength, Min } from "class-validator";

export class CreateReviewDto {
    @IsNotEmpty()
    @IsUUID()
    bookingId!: string;

    @IsNotEmpty()
    @IsUUID()
    venueId!: string;

    @IsNotEmpty()
    @IsUUID()
    customerId!: string;

    @IsNotEmpty()
    @IsInt()
    @Min(1)
    @Max(5)
    rating!: number;

    @IsOptional()
    @IsString()
    @Transform(({ value }) => {
        const trimmed = value?.trim();
        return trimmed === "" ? undefined : trimmed;
    })
    @MaxLength(1000)
    comment?: string;
}