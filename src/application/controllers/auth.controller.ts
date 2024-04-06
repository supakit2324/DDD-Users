import { Body, Controller, Logger, Post, UseGuards } from '@nestjs/common';
import { LoginService } from '../../domain/services/login.service';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { LoginDto } from '../dto/login.dto';
import { LoginAuthGuard } from '../../infrastructure/guards/login-auth.guard';
import { CreateTokenDto } from '../dto/create-token.dto';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);
  constructor(private readonly loginService: LoginService) {}

  @Post()
  @UseGuards(LoginAuthGuard)
  @ApiResponse({
    type: CreateTokenDto,
    status: 200,
  })
  async login(@Body() body: LoginDto): Promise<CreateTokenDto> {
    return this.loginService.login(body);
  }
}
