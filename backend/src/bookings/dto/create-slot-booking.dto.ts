import { Type } from "class-transformer";
import { IsDate, IsNotEmpty, IsUUID } from "class-validator";

export class CreateBookingSlotDto{
    @IsNotEmpty()
    @Type(() => Date)
    @IsDate()
    startAt!: Date;

    @IsNotEmpty()
    @Type(() => Date)
    @IsDate()
    endAt!: Date;
}