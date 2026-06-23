import { UserRole } from "../user.enums";
export declare class CreateUserDto {
    name: string;
    email: string;
    phoneNo: number;
    password: string;
    role: UserRole;
}
