import { UserRole, UserStatus } from "./user.enums";
export declare class User {
    id: string;
    name: string;
    email: string;
    phoneNo: string;
    password: string;
    role: UserRole;
    status: UserStatus;
    createdAt: Date;
}
