import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import { CreateUserDto } from '../users/dtos/CreateUser.dto';
import { UserService } from 'src/users/service/user/user.service';
import { UpdateUserDto } from './dtos/UpdateUser.dto';
import { LoginUserDto } from './dtos/LoginUser.dto';

@Controller('users')
export class UsersController {
  constructor(private userService: UserService) {}

  @Get('/auth/get-user')
  async getUser() {
    return this.userService.findUsers();
  }

  @Post('/auth/signup')
  async createUser(@Body() createUserDto: CreateUserDto) {
    try {
      const createdUser = await this.userService.createUser(createUserDto);
      return {
        error: false,
        message: 'Account Created!',
        user: {
          username: createdUser.username,
          email: createdUser.email,
          role: createdUser.role,
        },
      };
    } catch (error) {
      //   console.error('Error creating user:', error.message);
      return { error: true, message: 'Invalide Cridentials.' };
    }
  }

 s

  @Put('/auth/update-user/:id')
  async updateUserById(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    try {
      const updatedUser = await this.userService.updateUser(id, updateUserDto);
      return {
        message: 'User updated successfully',
        error: false,
        user: updatedUser,
      };
    } catch (error) {
      console.error('Error updating user:', error.message);
      return {
        message: 'Error updating user',
        error: true,
      };
    }
  }

  @Delete('/auth/delete-user/:id')
  async deleteUserById(@Param('id', ParseIntPipe) id: number) {
    try {
      await this.userService.deleteUser(id);
      return {
        message: 'User deleted successfully',
        error: false,
      };
    } catch (error) {
      console.error('Error deleting user:', error.message);
      return {
        message: 'Error deleting user',
        error: true,
      };
    }
  }
}
