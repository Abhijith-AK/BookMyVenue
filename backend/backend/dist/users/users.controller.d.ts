import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import type { User } from './user.model';
export declare class UsersController {
    private usersService;
    constructor(usersService: UsersService);
    getAllUsers(): User[];
    getUser(id: string): User;
    createUser(createUserDto: CreateUserDto): Promise<User>;
    updateUser(id: string, updateUserDto: UpdateUserDto): User;
    deleteUser(id: string): void;
}
