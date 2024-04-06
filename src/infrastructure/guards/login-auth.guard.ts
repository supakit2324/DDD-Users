import {
  ExecutionContext,
  Injectable,
  InternalServerErrorException,
  Logger,
  UnprocessableEntityException,
} from '@nestjs/common';
import { compare } from 'bcrypt';
import { AuthGuard } from '@nestjs/passport';
import { plainToInstance } from 'class-transformer';
import { LoginDto } from '../../application/dto/login.dto';
import { UsersRepository } from '../repository/users/users.repository';

@Injectable()
export class LoginAuthGuard extends AuthGuard('local') {
  private readonly logger = new Logger(LoginAuthGuard.name);
  constructor(private readonly usersRepository: UsersRepository) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const body = plainToInstance(LoginDto, request.body);

    let user: LoginDto;
    try {
      user = await this.usersRepository.findEmail(body.email);
    } catch (e) {
      this.logger.error(e?.message ?? JSON.stringify(e));
      throw new InternalServerErrorException({
        message: e?.message ?? JSON.stringify(e),
      });
    }

    if (!user) {
      throw new UnprocessableEntityException('Not Found User.');
    }

    const matchPassword = await compare(body.password, user.password);
    if (!matchPassword) {
      throw new UnprocessableEntityException(`Password are not valid.`);
    }
    return true;
  }
}
