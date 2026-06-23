import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { UserStatus } from './user.enums';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from "bcrypt";
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';

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

    async updateUser(id: string, updateUserDto: UpdateUserDto): Promise<User>{
        const {name, phoneNo} = updateUserDto;
        const user = await this.getUserById(id);
        if(name) user.name = name;
        if(phoneNo) user.phoneNo = phoneNo.toString();
        await this.userRepository.save(user);
        return user;
    }

    async deleteUser(id: string): Promise<void>{
       const result = await this.userRepository.delete(id)
        if (result.affected === 0) {
            throw new NotFoundException(`User with ID "${id}" not found`);
        }
    }

}