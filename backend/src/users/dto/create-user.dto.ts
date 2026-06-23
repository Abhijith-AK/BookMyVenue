import { IsEmail, IsEnum, IsNotEmpty, IsPhoneNumber, IsString, IsStrongPassword, MinLength } from "class-validator";
import { UserRole, UserStatus } from "../user.enums"

export class CreateUserDto {
    @IsNotEmpty()
    @IsString()
    name!: string;

    @IsNotEmpty()
    @IsEmail()
    email!: string;

    @IsNotEmpty()
    @IsPhoneNumber('IN')
    phoneNo!: number;

    @IsNotEmpty()
    @IsStrongPassword()
    password!: string;

    @IsNotEmpty()
    @IsEnum(UserRole)
    role!: UserRole;
}