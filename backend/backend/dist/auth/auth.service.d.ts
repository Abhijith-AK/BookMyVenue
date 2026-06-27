import { JwtService } from '@nestjs/jwt';
import { UsersService } from "../users/users.service";
import { GetUserT } from './get-user.models';
export declare class AuthService {
    private usersService;
    private jwtService;
    constructor(usersService: UsersService, jwtService: JwtService);
    validateUser(email: string, password: string): Promise<{
        id: string;
        name: string;
        email: string;
        phoneNo: string;
        role: import("../users/user.enums").UserRole;
        status: import("../users/user.enums").UserStatus;
        createdAt: Date;
    } | null>;
    login(user: GetUserT): Promise<{
        access_token: string;
        user: {
            id: string;
            name: string;
            email: string;
            role: import("../users/user.enums").UserRole;
        };
    }>;
}
