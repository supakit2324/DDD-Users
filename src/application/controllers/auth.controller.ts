import {
  Body,
  Controller,
  Logger,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { LoginService } from '../../domain/services/login.service';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { LoginDto } from '../dto/login.dto';
import { LoginAuthGuard } from '../../infrastructure/guards/login-auth.guard';
import { CreateTokenDto } from '../dto/create-token.dto';
import { LoggingInterceptor } from '../interceptors/logging.interceptor';
import { LoggerService } from '../../domain/services/logger.service';
import { ContextEntity } from '../../domain/entities/context.entity';

@Controller('auth')
@ApiTags('auth')
@UseInterceptors(LoggingInterceptor)
export class AuthController {
  private readonly logger: LoggerService = new LoggerService(
    AuthController.name,
  );
  constructor(private readonly loginService: LoginService) {}

  @Post()
  @UseGuards(LoginAuthGuard)
  @ApiResponse({
    type: CreateTokenDto,
    status: 200,
  })
  async login(@Body() body: LoginDto): Promise<CreateTokenDto> {
    const context: ContextEntity = {
      module: AuthController.name,
      method: 'login',
    };
    this.logger.logger(body, context);
    return this.loginService.login(body);
  }
}
