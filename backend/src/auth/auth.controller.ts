import { Controller, Post, Body, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post('register')
    async register(@Body() userDto: any) {
        return this.authService.register(userDto);
    }

    @Post('login')
    async login(@Body() loginDto: any) {
        const user = await this.authService.validateUser(
            loginDto.email,
            loginDto.password,
        );
        if (!user) {
            return { error: 'Invalid credentials' };
        }
        return this.authService.login(user);
    }
}