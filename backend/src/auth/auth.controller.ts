import { Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { GetUser } from './decorators/get-user.decorator';
import type { GetUserT, JwtUser } from './get-user.models';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { Public } from './decorators/public.decorator';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService){}

    @UseGuards(LocalAuthGuard)
    @Public()
    @Post('login')
    async login(@GetUser() user: GetUserT){
        return this.authService.login(user);
    }

    @UseGuards(JwtAuthGuard)
    @Get("me")
    getMe(@GetUser() user: JwtUser) {
        return user;
    }
}