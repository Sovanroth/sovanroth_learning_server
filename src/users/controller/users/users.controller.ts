import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { CreateUserDto } from '../users/dtos/CreateUser.dto';
import { UserService } from '../../service/user/user.service';
import { UpdateUserDto } from './dtos/UpdateUser.dto';
import { LoginUserDto } from './dtos/LoginUser.dto';
import { User } from 'src/typeorm/entities/User';
import { UserProfileDto } from './dtos/UserProfile.dto';
import { UpdateProfileDto } from './dtos/UpdateProfile.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { CloudinaryService } from '../../../cloudinary/cloudinary.service';
import { ForgotPasswordDto } from 'src/courses/controller/courses/dtos/ForgotPassword.dto';

@Controller('users')
export class UsersController {
  constructor(
    private userService: UserService,
    private cloudinaryService: CloudinaryService,
  ) {}

  @Get('/auth/get-user')
  async getUser() {
    try {
      const users = await this.userService.findUsers();
      return {
        error: false,
        message: 'get successful',
        users: users.map((user) => ({
          id: user.id,
          username: user.username,
          email: user.email,
          password: user.password,
          role: user.role,
          createdAt: user.createdAt,
          courses: user.courses,
        })),
      };
    } catch (error) {
      return {
        error: true,
        message: 'Error getting users',
        users: [],
      };
    }
  }

  @Get('/auth/get-user-by-id/:id')
  async getUserById(@Param('id') id: number) {
    return this.userService.findUserById(id);
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
      if (error.message === 'Email is already in use') {
        return { error: true, message: 'Email is already in use' };
      }
      return { error: true, message: 'Invalid Credentials' };
    }
  }

  @Post('/auth/login')
  @HttpCode(200)
  async login(@Body() loginDto: LoginUserDto) {
    try {
      const result = await this.userService.login(loginDto);

      if (result) {
        return {
          error: false,
          message: 'Login successful',
          user: {
            id: result.user.id,
            username: result.user.username,
            email: result.user.email,
            password: result.user.password,
            role: result.user.role,
            token: result.token,
          },
        };
      } else {
        return {
          error: true,
          message: 'Invalid credentials',
        };
      }
    } catch (error) {
      console.error('Error during login:', error.message);
      return {
        error: true,
        message: 'Error during login',
      };
    }
  }

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

  @Post('/buy-course')
  async buyCourse(
    @Query('userId') userId: number,
    @Query('courseId') courseId: number,
  ) {
    return this.userService.buyCourse(userId, courseId);
  }

  @Post('/upload-profile/:id')
  @UseInterceptors(FileInterceptor('file'))
  async uploadProfilePicture(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile() file: Express.Multer.File,
  ) {
    try {
      const uploadResult = await this.cloudinaryService.uploadFile(file);
      const imageUrl = uploadResult.secure_url;
      // console.log('data', imageUrl);

      await this.userService.uploadPic(id, { profileImage: imageUrl });
      return {
        error: false,
        message: 'Profile uploaded successfully',
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        return {
          error: true,
          message: 'User not found',
        };
      } else {
        console.log(this.cloudinaryService.uploadFile(file));
        return {
          error: true,
          message: 'Error upload profile',
        };
      }
    }
  }

  @Get('/get-all-profiles')
  async getAllProfiles() {
    try {
      const profiles = await this.userService.getProfiles();

      return {
        error: false,
        message: 'Get Successfully',
        data: profiles,
      };
    } catch (error) {
      return {
        error: true,
        message: 'Error getting profiles',
        data: null,
      };
    }
  }

  @Put('/update-user-profile/:id')
  @UseInterceptors(FileInterceptor('file'))
  async updateProfile(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile() file: Express.Multer.File,
  ) {
    try {
      const uploadResult = await this.cloudinaryService.uploadFile(file);
      const imageUrl = uploadResult.secure_url;
      await this.userService.updateUserProfile(id, { profileImage: imageUrl });

      return {
        message: 'User profile updated successfully',
        error: false,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        return {
          message: 'Profile not found',
          error: true,
        };
      } else {
        return {
          message: 'Error updating Profile',
          error: true,
        };
      }
    }
  }

  @Delete('/delete-user-profile/:id')
  async deleteProfilePicture(@Param('id', ParseIntPipe) id: number) {
    try {
      await this.userService.deleteProfile(id);
      return {
        message: 'Profile deleted successfully',
        error: false,
      };
    } catch (error) {
      console.error('Error deleting profile:', error.message);
      return {
        message: error.message || 'Error deleting profile',
        error: true,
      };
    }
  }

  @Get('/get-all-course-by-user/:id')
  async getAllCoursesByUser(@Param('id') userId: number) {
    return this.userService.getAllCoursesByUser(userId);
  }

  @Get('/get-one-course')
  async getCourseByUserIdAndCourseId(
    @Query('userId') userId: number,
    @Query('courseId') courseId: number,
  ) {
    return this.userService.getCourseByUserIdAndCourseId(userId, courseId);
  }

  @Get('/get-category/')
  async getCategoryByUser(
    @Query('categoryId') categoryId: number,
    @Query('userId') userId: number,
  ) {
    return this.userService.getCategoryByUser(userId, categoryId);
  }

  @Post('/auth/forgot-password')
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    try {
      const user = await this.userService.forgotPassword(forgotPasswordDto);
      return {
        message: 'request successfully',
        error: false,
      };
    } catch (error) {
      console.error('Error updating user:', error.message);
      return {
        message: 'Error updating user',
        error: true,
      };
    }
  }
}
