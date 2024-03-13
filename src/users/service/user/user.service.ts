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
import { Course } from 'src/typeorm/entities/Course';
import { CourseService } from 'src/courses/service/course/course.service';
import { Profile } from 'src/typeorm/entities/Profile';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

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
      userId: user.id,
      username: user.username,
      email: user.email,
    };
    const options = { expiresIn: '7D' };

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
      // Compare hashed password
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
      throw new NotFoundException('Video not found');
    }
    return result;
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
}
