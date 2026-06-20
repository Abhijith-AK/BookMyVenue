import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { User, UserStatus } from './user.model';
import { CreateUserDto } from './dto/create-user.dto';
import { randomUUID } from 'crypto';
import * as bcrypt from "bcrypt";
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
    private users : User[] = [];

    getAllUsers(): User[] {
        return this.users;
    }

    getUserById(id: string): User {
        const user = this.users.find(user => user.id == id);
        if(!user) throw new NotFoundException(`the user with id ${id} not found!`);
        return user;
    }

    async createUser(createUserDto: CreateUserDto): Promise<User> {
        const found = this.users.find(user => user.email === createUserDto.email);
        if(found) throw new ConflictException("email already exists");
        const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
        const user = {
            id: randomUUID(),
            ...createUserDto,
            password: hashedPassword,
            status: UserStatus.ACTIVE,
            createdAt: new Date()
        }
        this.users.push(user);
        return user;
    }

    updateUser(id: string, updateUserDto: UpdateUserDto): User{
        const {name, phoneNo} = updateUserDto
        const user = this.getUserById(id);
        if(name) user.name = name;
        if(phoneNo) user.phoneNo = phoneNo;
        return user;
    }

    deleteUser(id: string): void{
       this.getUserById(id);
       this.users = this.users.filter(user => user.id !== id);
    }

}