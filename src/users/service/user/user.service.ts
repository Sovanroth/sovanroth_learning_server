import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../../typeorm/entities/User';
import { Repository } from 'typeorm';
import {
  CreateUserParams,
  CreateUserProfileParams,
  LoginUserParams,
  UpdateProfileParams,
  UpdateUserParams,
} from '../../../utils/type';
import { LoginUserDto } from 'src/users/controller/users/dtos/LoginUser.dto';
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import * as nodemailer from 'nodemailer';
import { Course } from '../../../typeorm/entities/Course';
import { CourseService } from '../../../courses/service/course/course.service';
import { Profile } from '../../../typeorm/entities/Profile';
import { CloudinaryService } from '../../../cloudinary/cloudinary.service';
import { ForgotPasswordDto } from 'src/courses/controller/courses/dtos/ForgotPassword.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Course) private courseRepository: Repository<Course>,
    @InjectRepository(Profile) private profileRepository: Repository<Profile>,
    private courseService: CourseService,
    private cloudinary: CloudinaryService,
  ) {}

  private generateToken(user: User): string {
    const payload = {
      // userId: user.id,
      username: user.username,
      email: user.email,
    };
    const options = { expiresIn: '10s' };

    return jwt.sign(payload, 'your-secret-key', options);
  }

  findUsers() {
    return this.userRepository.find();
  }

  async findUserById(id: number) {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['profile', 'courses', 'courses.videos'],
    });

    if (!user) {
      return { error: true, message: 'User not found' };
    }

    const { ...userData } = user;
    return { error: false, message: 'Get Successfully', data: userData };
  }

  async createUser(userDetails: CreateUserParams): Promise<User> {
    const { email, password, ...rest } = userDetails;

    const existingUser = await this.userRepository.findOne({
      where: { email },
    });
    if (existingUser) {
      throw new Error('Email is already in use');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = this.userRepository.create({
      createdAt: new Date(),
      password: hashedPassword,
      email,
      ...rest,
    });

    return this.userRepository.save(newUser);
  }

  async login(
    loginDto: LoginUserDto,
  ): Promise<{ user: User; token: string } | null> {
    const { email, password } = loginDto;

    const user = await this.userRepository.findOne({ where: { email } });

    if (user && (await bcrypt.compare(password, user.password))) {
      const token = this.generateToken(user);
      return { user, token };
    }

    return null;
  }

  async updateUser(id: number, updateUserDetail: UpdateUserParams) {
    if (updateUserDetail.password) {
      updateUserDetail.password = await bcrypt.hash(
        updateUserDetail.password,
        10,
      );
    }
    await this.userRepository.update({ id }, { ...updateUserDetail });
  }

  async deleteUser(id: number) {
    return this.userRepository.delete({ id });
  }

  async buyCourse(userId: number, courseId: number) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['courses'],
    });
    if (!user) {
      return { error: true, message: 'User not found' };
    }

    const course = await this.courseService.getCourseById(courseId);
    if (!course) {
      return { error: true, message: 'Course not found' };
    }

    user.courses.push(course);

    await this.userRepository.save(user);

    return { error: false, message: 'Course bought successfully' };
  }

  async uploadPic(
    id: number,
    createUserProfileDetail: CreateUserProfileParams,
  ) {
    const newProfile = this.profileRepository.create({
      ...createUserProfileDetail,
      user: { id },
    });

    return this.profileRepository.save(newProfile);
  }

  async getProfiles(options?: any): Promise<Profile[]> {
    return await this.profileRepository.find(options);
  }

  async updateUserProfile(
    id: number,
    updateProfileDetail: UpdateProfileParams,
  ) {
    const result = this.profileRepository.update(
      { id },
      { ...updateProfileDetail },
    );

    if ((await result).affected === 0) {
      throw new NotFoundException('Profile not found');
    }
  }

  async deleteProfile(id: number) {
    const profile = await this.profileRepository.findBy({ id });
    if (!profile) {
      throw new NotFoundException('Profile not found');
    }

    await this.userRepository.update({ profile: { id } }, { profile: null });

    const result = await this.profileRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException('Profile not found');
    }

    return result;
  }

  async getAllCoursesByUser(userId: number) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['courses', 'courses.videos'],
    });

    if (!user) {
      return { error: true, message: 'User not found' };
    }

    const courses = await this.courseService.getCourseByActiveStatus({
      where: { active: 1 },
    });

    const ownedCourses = courses.map((course) => {
      const owned = user.courses.some(
        (userCourse) => userCourse.id === course.id,
      );
      return {
        ...course,
        owned: owned ? 1 : 0,
      };
    });

    return { error: false, message: 'Get Successfully', data: ownedCourses };
  }

  async getCategoryByUser(userId: number, categoryId: number) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['courses', 'courses.videos'],
    });

    if (!user) {
      return { error: true, message: 'User not found' };
    }

    const courses = await this.courseService.findByCategory(categoryId);

    if (!courses || courses.length === 0) {
      return {
        error: true,
        message: 'No courses found for the given category',
      };
    }

    const ownedCourses = courses.map((course) => {
      const owned = user.courses.some(
        (userCourse) => userCourse.id === course.id,
      );
      return {
        ...course,
        owned: owned ? 1 : 0,
      };
    });
    return { error: false, message: 'Get Successfully', data: ownedCourses };
  }

  async getCourseByUserIdAndCourseId(userId: number, courseId: number) {
    try {
      const user = await this.findUserById(userId);
      if (user.error) {
        return {
          error: true,
          message: user.message,
          data: null,
        };
      }

      const course = await this.courseService.getCourseById(courseId);
      if (!course) {
        return {
          error: true,
          message: 'Course not found',
          data: null,
        };
      }

      const owned = user.data.courses.some(
        (userCourse) => userCourse.id === course.id,
      );

      return {
        error: false,
        message: 'Get Successfully',
        data: {
          ...course,
          owned: owned ? 1 : 0,
        },
      };
    } catch (error) {
      return {
        error: true,
        message: 'Error fetching course',
        data: null,
      };
    }
  }

  async forgotPassword(email: string): Promise<string> {
    const user = await this.userRepository.findOne({ where: { email } });

    if (!user) {
      throw new Error('User not found');
    }

    const resetToken = crypto.randomBytes(20).toString('hex');
    const resetTokenExpiration = new Date();
    resetTokenExpiration.setHours(resetTokenExpiration.getHours() + 1);

    user.resetToken = resetToken;
    user.resetTokenExpiration = resetTokenExpiration;

    await this.userRepository.save(user);

    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: 'nsovanroth@gmail.com',
        pass: 'nhwr cabe hnvz xury',
      },
    });

    await transporter.sendMail({
      from: 'nsovanroth@gmail.com',
      to: email,
      subject: 'Password Reset',
      text: `To reset your password, please use the following link: https://sukulpf.sovanrothnath.site/forgot-password/reset-password/${resetToken}`,
      html: `
      <p>Hello,</p>
      <p>You have requested to reset your password. Click the link below to reset your password:</p>
      <p><a href="https://sukulpf.sovanrothnath.site/forgot-password/reset-password/${resetToken}">Reset Password</a></p>
      <p>If you did not request a password reset, please ignore this email. Your password will remain unchanged.</p>
      <p>Best regards,</p>
      <p>Suku Learning Team</p>
      `,
    });

    return resetToken;
  }

  async resetPassword(token: string, newPassword: string): Promise<boolean> {
    const user = await this.userRepository.findOne({
      where: { resetToken: token },
    });

    if (!user || user.resetTokenExpiration < new Date()) {
      return false;
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;

    await this.userRepository.save(user);

    return true;
  }
}
