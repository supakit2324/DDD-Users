import { Injectable } from '@nestjs/common';
import { UsersRepository } from '../../infrastructure/repository/users/users.repository';
import { CreateUserDto } from '../../application/dto/create-user.dto';
import { Users } from '../../infrastructure/models/users.schema';

@Injectable()
export class CreateService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async create(payload: CreateUserDto): Promise<Users> {
    return await this.usersRepository.create(payload);
  }
}
