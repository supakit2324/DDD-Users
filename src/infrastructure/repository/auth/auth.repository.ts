import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { CreateTokenDto } from '../../../application/dto/create-token.dto';

@Injectable()
export class AuthRepository {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  async createToken(email: string): Promise<CreateTokenDto> {
    const jwtOption: JwtSignOptions = {
      expiresIn: '2day',
      secret: this.configService.get<string>('authentication.secret'),
    };

    const [token] = await Promise.all([
      this.jwtService.signAsync(
        {
          email,
        },
        jwtOption,
      ),
    ]);
    return { token };
  }
}
