import { Injectable, Logger } from '@nestjs/common';
import { UsersRepository } from '../../infrastructure/repository/users/users.repository';
import { UpdateUserDto } from '../../application/dto/update-user.dto';

@Injectable()
export class UpdateService {
  private readonly logger = new Logger(UpdateService.name);
  constructor(private readonly usersRepository: UsersRepository) {}

  async update(userId: string, payload: UpdateUserDto): Promise<UpdateUserDto> {
    return await this.usersRepository.update(userId, payload);
  }
}
