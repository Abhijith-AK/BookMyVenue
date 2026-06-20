export interface User {
    id: string,
    name: string,
    email: string,
    phoneNo: number,
    password: string,
    role: UserRole,
    status: UserStatus,
    createdAt: Date
}

export enum UserStatus {
    ACTIVE = 'ACTIVE',
    BANNED = 'BANNED'
}

export enum UserRole {
    OWNER = 'OWNER',
    CUSTOMER = 'CUSTOMER' 
}