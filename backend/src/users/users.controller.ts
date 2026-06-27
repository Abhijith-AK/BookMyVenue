import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './user.entity';
import { Public } from 'src/auth/decorators/public.decorator';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserRole } from './user.enums';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import type { JwtUser } from 'src/auth/get-user.models';

@Controller('users')
export class UsersController {
    constructor(private usersService : UsersService){}

    @UseGuards(RolesGuard)
    @Roles(UserRole.ADMIN)
    @Get()
    getAllUsers(): Promise<User[]>{
        return this.usersService.getAllUsers();
    }

    @Get('/:id')
    getUser(@GetUser() user: JwtUser): Promise<User>{
        return this.usersService.getUserById(user.id);
    }

    @Public()
    @Post()
    createUser(@Body() createUserDto: CreateUserDto): Promise<User>{
        return this.usersService.createUser(createUserDto);
    }

    @Patch('/:id')
    updateUser(@GetUser() user: JwtUser, @Param('id', new ParseUUIDPipe()) id: string, @Body() updateUserDto: UpdateUserDto): Promise<User>{
        return this.usersService.updateUser(user, id, updateUserDto);
    }

    @Delete('/:id')
    deleteUser(@GetUser() user: JwtUser, @Param('id', new ParseUUIDPipe()) id: string): Promise<void>{
        return this.usersService.deleteUser(user, id);
    }
}
