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
  LoginUserParams,
  UpdateUserParams,
} from '../../../utils/type';
import { LoginUserDto } from 'src/users/controller/users/dtos/LoginUser.dto';
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';

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
    const options = { expiresIn: '7D' };

    return jwt.sign(payload, 'your-secret-key', options);
  }

  findUsers() {
    return this.userRepository.find();
  }

  async findUserById(id: number) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      return { error: true, message: 'User not found' };
    }
    const { password, ...userData } = user;
    return { error: false, message: 'Get Successfully', data: userData };
  }

  async createUser(userDetails: CreateUserParams): Promise<User> {
    const { password, ...rest } = userDetails;
    const hashedPassword = await bcrypt.hash(password, 10); // Hash the password

    const newUser = this.userRepository.create({
      createdAt: new Date(),
      password: hashedPassword,
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
      ); // Hash new password
    }
    await this.userRepository.update({ id }, { ...updateUserDetail });
  }

  async deleteUser(id: number) {
    return this.userRepository.delete({ id });
  }

  async buyCourse(userId: number) {
    
  }
}
