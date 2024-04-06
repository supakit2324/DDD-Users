import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  PipeTransform,
} from '@nestjs/common';
import { UsersRepository } from '../repository/users/users.repository';
import { CreateUserDto } from '../../application/dto/create-user.dto';
import { ConfigService } from '@nestjs/config';
import { hash } from 'bcrypt';

@Injectable()
export class CreateUserValidationPipe implements PipeTransform {
  private readonly logger = new Logger(CreateUserValidationPipe.name);
  constructor(
    private readonly configService: ConfigService,
    private readonly usersRepository: UsersRepository,
  ) {}

  async transform(body: CreateUserDto): Promise<CreateUserDto> {
    let user: CreateUserDto;
    try {
      user = await this.usersRepository.findEmail(body.email);
    } catch (e) {
      this.logger.error(`Error email: ${e?.message ?? JSON.stringify(e)}`);
      throw new InternalServerErrorException({
        message: e?.message ?? e,
      });
    }

    if (user) {
      throw new BadRequestException(`Email ${body.email} already exists`);
    }
    const hashSize = this.configService.get<string>('authentication.hashSize');
    let hashPassword: string;
    try {
      hashPassword = await hash(body.password, hashSize);
    } catch (e) {
      this.logger.error(
        `Error hashing password: ${e?.message ?? JSON.stringify(e)}`,
      );
      throw new InternalServerErrorException({
        message: e?.message ?? e,
      });
    }

    body.password = hashPassword;
    return body;
  }
}
