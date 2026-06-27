import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './user.entity';
import type { JwtUser } from "../auth/get-user.models";
export declare class UsersController {
    private usersService;
    constructor(usersService: UsersService);
    getAllUsers(): Promise<User[]>;
    getUser(user: JwtUser): Promise<User>;
    createUser(createUserDto: CreateUserDto): Promise<User>;
    updateUser(user: JwtUser, id: string, updateUserDto: UpdateUserDto): Promise<User>;
    deleteUser(user: JwtUser, id: string): Promise<void>;
}
