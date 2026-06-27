import { UserRole } from "../user.enums";
export declare class CreateUserDto {
    name: string;
    email: string;
    phoneNo: string;
    password: string;
    role: UserRole;
}
