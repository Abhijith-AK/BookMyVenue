import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import type { JwtUser } from "../auth/get-user.models";
export declare class UsersService {
    private userRepository;
    constructor(userRepository: Repository<User>);
    getAllUsers(): Promise<User[]>;
    getUserById(id: string): Promise<User>;
    findByEmailForLogin(email: string): Promise<User | null>;
    createUser(createUserDto: CreateUserDto): Promise<User>;
    updateUser(user1: JwtUser, id: string, updateUserDto: UpdateUserDto): Promise<User>;
    deleteUser(user1: JwtUser, id: string): Promise<void>;
}
