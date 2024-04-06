import {
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { LoggerService } from '../../domain/services/logger.service';
import { CreateService } from '../../domain/services/create.service';
import { CreateUserValidationPipe } from '../../infrastructure/pipes/create-user-validation.pipe';
import { CreateUserDto } from '../dto/create-user.dto';
import { ContextEntity } from '../../domain/entities/context.entity';
import { JwtAuthGuard } from '../../infrastructure/guards/jwt-auth.guard';
import ReqUser from '../../infrastructure/decorators/req-user.decorator';

@Controller('user')
@ApiTags('user')
export class UsersController {
  private readonly logger: LoggerService = new LoggerService(
    UsersController.name,
  );
  constructor(private readonly createService: CreateService) {}

  @Post()
  async create(
    @Body(CreateUserValidationPipe) body: CreateUserDto,
  ): Promise<CreateUserDto> {
    try {
      const context: ContextEntity = {
        module: UsersController.name,
        method: 'create',
      };
      this.logger.logger(body, context);
      return await this.createService.create(body);
    } catch (e) {
      this.logger.error(`Error email: ${e?.message ?? JSON.stringify(e)}`);
      throw new InternalServerErrorException({
        message: e?.message ?? e,
      });
    }
  }

  @Get('me')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async getMe(@ReqUser() user: any): Promise<any> {
    return user;
  }
}
