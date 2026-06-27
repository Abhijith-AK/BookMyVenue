import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from "bcrypt";
import { GetUserT } from './get-user.models';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService
    ){}

    async validateUser(email: string, password: string){
        const user = await this.usersService.findByEmailForLogin(email);
        if(!user) throw new UnauthorizedException("check your login credentials");
        if (user && await bcrypt.compare(password, user.password)){
            const {password, ...result} = user;
            return result;
        }
        return null;
    }

    async login(user: GetUserT){
        const payload = { email: user.email, sub: user.id, role: user.role, name: user.name };
        const access_token = this.jwtService.sign(payload)
        return {
            access_token,
             user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        };
    }
}
