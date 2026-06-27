import { UserRole, UserStatus } from "src/users/user.enums";

export interface GetUserT{
    id: string;
    name: string;
    email: string;
    phoneNo: string;
    role: UserRole;
    status: UserStatus;
    createdAt: Date;    
}

export interface JwtUser {
    id: string;
    email: string;
    role: UserRole;
}