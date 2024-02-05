import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
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
    const options = { expiresIn: '7D' };

    return jwt.sign(payload, 'your-secret-key', options);
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
    // const user = await this.userRepository.findOneBy({ id });
    // if (!user) {
    //   throw new HttpException('User cannot be found', HttpStatus.BAD_REQUEST);
    // }

    await this.userRepository.update({ id }, { ...updateUserDetail });
  }

  async deleteUser(id: number) {
    // const user = await this.userRepository.findOneBy({ id });
    // if (!user) {
    //   throw new HttpException('User cannot be found', HttpStatus.BAD_REQUEST);
    // }

    return this.userRepository.delete({ id });
  }
}
