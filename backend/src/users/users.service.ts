import { ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { UserRole, UserStatus } from './user.enums';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from "bcrypt";
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import type { JwtUser } from 'src/auth/get-user.models';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>
    ){}

    async getAllUsers(): Promise<User[]> {
        return await this.userRepository.find();
    }

    async getUserById(id: string): Promise<User> {
        const user = await this.userRepository.findOne({where: {id}});
        if(!user) throw new NotFoundException(`the user with id ${id} not found!`);
        return user;
    }

    async findByEmailForLogin(email: string) {
        const user = await this.userRepository
                             .createQueryBuilder("user")
                             .addSelect("user.password")
                             .where("user.email = :email", { email })
                             .getOne();
        return user;
    }

    async createUser(createUserDto: CreateUserDto): Promise<User> {
        const found = await this.userRepository.findOne({where: {email: createUserDto.email}});
        if(found) throw new ConflictException("email already exists");
        const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
        const user = this.userRepository.create({
            ...createUserDto,
            phoneNo: createUserDto.phoneNo.toString(),
            password: hashedPassword,
            status: UserStatus.ACTIVE,
        })
        await this.userRepository.save(user);
        return user;
    }

    async updateUser(user1: JwtUser, id: string, updateUserDto: UpdateUserDto): Promise<User>{
        const {name, phoneNo} = updateUserDto;
        const user = await this.getUserById(id);
        if(user.id !== user1.id && user.role !== UserRole.ADMIN) throw new ForbiddenException()
        if(name) user.name = name;
        if(phoneNo) user.phoneNo = phoneNo.toString();
        await this.userRepository.save(user);
        return user;
    }

    async deleteUser(user1: JwtUser, id: string): Promise<void>{
        const user = await this.getUserById(id);
        if(user.id !== user1.id && user.role !== UserRole.ADMIN) throw new ForbiddenException()
        await this.userRepository.delete(id)
    }

}