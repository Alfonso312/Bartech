import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
export declare class AuthService {
    private usersService;
    private jwtService;
    constructor(usersService: UsersService, jwtService: JwtService);
    validateUser(email: string, pass: string): Promise<import("../users/user.model").User>;
    login(email: string, password: string): Promise<{
        access_token: string;
    }>;
    register(userDto: any): Promise<import("../users/user.model").User>;
}
