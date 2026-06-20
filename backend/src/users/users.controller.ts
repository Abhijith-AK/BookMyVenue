import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import type { User } from './user.model';

@Controller('users')
export class UsersController {
    constructor(private usersService : UsersService){}

    @Get()
    getAllUsers(): User[]{
        return this.usersService.getAllUsers();
    }

    @Get('/:id')
    getUser(@Param('id', new ParseUUIDPipe()) id: string): User{
        return this.usersService.getUserById(id);
    }

    @Post()
    async createUser(@Body() createUserDto: CreateUserDto): Promise<User>{
        return await this.usersService.createUser(createUserDto);
    }

    @Patch('/:id')
    updateUser(@Param('id', new ParseUUIDPipe()) id: string, @Body() updateUserDto: UpdateUserDto): User{
        return this.usersService.updateUser(id, updateUserDto);
    }

    @Delete('/:id')
    deleteUser(@Param('id', new ParseUUIDPipe()) id: string): void{
        return this.usersService.deleteUser(id);
    }
}
