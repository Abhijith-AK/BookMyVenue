import { AuthService } from './auth.service';
import type { GetUserT, JwtUser } from './get-user.models';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    login(user: GetUserT): Promise<{
        access_token: string;
        user: {
            id: string;
            name: string;
            email: string;
            role: import("../users/user.enums").UserRole;
        };
    }>;
    getMe(user: JwtUser): JwtUser;
}
