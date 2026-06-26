import { Transform } from "class-transformer";
import { IsInt, IsOptional, IsString, Max, MaxLength, Min } from "class-validator";

export class UpdateReviewDto {

    @IsOptional()
    @IsInt()
    @Min(1)
    @Max(5)
    rating?: number;

    @IsOptional()
    @IsString()
    @Transform(({ value }) => {
        const trimmed = value?.trim();
        return trimmed === "" ? undefined : trimmed;
    })
    @MaxLength(1000)
    comment?: string;
}