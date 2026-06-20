import { UserRole } from "../user.model";
export declare class CreateUserDto {
    name: string;
    email: string;
    phoneNo: number;
    password: string;
    role: UserRole;
}
