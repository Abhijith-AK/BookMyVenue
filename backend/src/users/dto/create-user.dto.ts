import { IsEmail, IsEnum, IsNotEmpty, IsPhoneNumber, IsString, IsStrongPassword, MinLength } from "class-validator";
import { UserRole, UserStatus } from "../user.enums"
import { Type } from "class-transformer";

export class CreateUserDto {
    @IsNotEmpty()
    @IsString()
    name!: string;

    @IsNotEmpty()
    @IsEmail()
    email!: string;

    @IsNotEmpty()
    @IsPhoneNumber('IN')
    phoneNo!: string;

    @IsNotEmpty()
    @IsStrongPassword()
    password!: string;

    @IsNotEmpty()
    @IsEnum(UserRole, {message: "invalid role"})
    role!: UserRole;
}