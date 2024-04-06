import { Injectable } from '@nestjs/common';
import { UsersRepository } from '../../infrastructure/repository/users/users.repository';
import { CreateUserDto } from '../../application/dto/create-user.dto';
import { UserDto } from '../../application/dto/user.dto';

@Injectable()
export class CreateService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async create(payload: CreateUserDto): Promise<UserDto> {
    return await this.usersRepository.create(payload);
  }
}
