import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersRepository } from '../repository/users/users.repository';
import { LoginDto } from '../../application/dto/login.dto';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly usersRepository: UsersRepository,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('authentication.secret'),
    });
  }

  async validate(payload: LoginDto) {
    const { email } = payload;

    const user = await this.usersRepository.findEmail(email);

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
