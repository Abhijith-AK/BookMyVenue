import { Type } from "class-transformer";
import { IsNotEmpty, IsNumber, IsString, Min } from "class-validator";

export class CreateOrderDto{
    @IsNotEmpty()
    @Type(() => Number)
    @IsNumber()
    @Min(1)
    amount!: number;

    @IsNotEmpty()
    @IsString()
    receipt!: string;
}