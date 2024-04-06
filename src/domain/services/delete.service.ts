import { Injectable, Logger } from '@nestjs/common';
import { UsersRepository } from '../../infrastructure/repository/users/users.repository';
import { UserDto } from '../../application/dto/user.dto';

@Injectable()
export class DeleteService {
  private readonly logger = new Logger(DeleteService.name);
  constructor(private readonly usersRepository: UsersRepository) {}

  async delete(userId: string): Promise<UserDto> {
    return await this.usersRepository.delete(userId);
  }
}
