import { Injectable } from '@nestjs/common';
import { UsersRepository } from '../../infrastructure/repository/users/users.repository';
import { UserDto } from '../../application/dto/user.dto';

@Injectable()
export class FindUsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async find(): Promise<UserDto[]> {
    return await this.usersRepository.find();
  }
}
