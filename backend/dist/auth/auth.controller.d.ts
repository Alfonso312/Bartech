import { AuthService } from './auth.service';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    register(userDto: any): Promise<import("../users/user.model").User>;
    login(loginDto: any): Promise<{
        access_token: string;
    } | {
        error: string;
    }>;
}
