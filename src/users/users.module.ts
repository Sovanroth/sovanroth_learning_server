import { Module } from '@nestjs/common';
import { UsersController } from './controller/users/users.controller';
import { UserService } from './service/user/user.service';

@Module({
  controllers: [UsersController],
  providers: [UserService]
})
export class UsersModule {}
