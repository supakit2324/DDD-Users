import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { AuthRepository } from '../../infrastructure/repository/auth/auth.repository';
import { UsersRepository } from '../../infrastructure/repository/users/users.repository';
import { LoginDto } from '../../application/dto/login.dto';
import { CreateTokenDto } from '../../application/dto/create-token.dto';
import { LoggerService } from './logger.service';
import { UsersController } from '../../application/controllers/users.controller';

@Injectable()
export class LoginService {
  private readonly logger: LoggerService = new LoggerService(
    UsersController.name,
  );
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly usersRepository: UsersRepository,
  ) {}

  async login(body: LoginDto): Promise<CreateTokenDto> {
    const { email } = body;
    let createToken: CreateTokenDto;
    try {
      createToken = await this.authRepository.createToken(email);
    } catch (e) {
      this.logger.error(
        `catch on login-createTokens: ${e?.message ?? JSON.stringify(e)}`,
      );
      throw new InternalServerErrorException({
        message: e?.message ?? e,
      });
    }

    const token = {
      token: createToken.token,
    };

    try {
      await this.usersRepository.getUserModel().updateOne(
        {
          email,
        },
        {
          ...token,
        },
      );
    } catch (e) {
      this.logger.error(
        `catch on login-createTokens: ${e?.message ?? JSON.stringify(e)}`,
      );
      throw new InternalServerErrorException({
        message: e?.message ?? e,
      });
    }
    return token;
  }
}
