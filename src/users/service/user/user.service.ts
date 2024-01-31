import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../../typeorm/entities/User';
import { Repository } from 'typeorm';
import {
  CreateUserParams,
  LoginUserParams,
  UpdateUserParams,
} from '../../../utils/type';
import { LoginUserDto } from 'src/users/controller/users/dtos/LoginUser.dto';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  private generateToken(user: User): string {
    const payload = {
      userId: user.id,
      username: user.username,
      email: user.email,
    };
    const options = { expiresIn: '1h' }; // Set your desired expiration time

    return jwt.sign(payload, 'your-secret-key', options); // Replace 'your-secret-key' with your actual secret key
  }

  findUsers() {
    return this.userRepository.find();
  }

  createUser(userDetails: CreateUserParams): Promise<User> {
    const newUser = this.userRepository.create({
      createdAt: new Date(),
      ...userDetails,
    });

    return this.userRepository.save(newUser);
  }

  async login(
    loginDto: LoginUserDto,
  ): Promise<{ user: User; token: string } | null> {
    const { email, password } = loginDto;

    // Assuming you have a method like findByEmailAndPassword in your repository
    const user = await this.userRepository.findOne({
      where: { email, password },
    });

    if (user) {
      const token = this.generateToken(user);
      return { user, token };
    }

    return null;
  }

  async updateUser(id: number, updateUserDetail: UpdateUserParams) {
    await this.userRepository.update({ id }, { ...updateUserDetail });
  }

  deleteUser(id: number) {
    return this.userRepository.delete({ id });
  }
}