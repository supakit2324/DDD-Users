import {
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  Post,
  Put,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { LoggerService } from '../../domain/services/logger.service';
import { CreateService } from '../../domain/services/create.service';
import { CreateUserValidationPipe } from '../../infrastructure/pipes/create-user-validation.pipe';
import { CreateUserDto } from '../dto/create-user.dto';
import { ContextEntity } from '../../domain/entities/context.entity';
import { JwtAuthGuard } from '../../infrastructure/guards/jwt-auth.guard';
import ReqUser from '../../infrastructure/decorators/req-user.decorator';
import { LoggingInterceptor } from '../interceptors/logging.interceptor';
import { UserDto } from '../dto/user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { UpdateService } from '../../domain/services/update.service';

@Controller('user')
@ApiTags('user')
@UseInterceptors(LoggingInterceptor)
export class UsersController {
  private readonly logger: LoggerService = new LoggerService(
    UsersController.name,
  );
  constructor(
    private readonly createService: CreateService,
    private readonly updateService: UpdateService,
  ) {}

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
  @ApiResponse({
    status: 200,
    type: UserDto,
  })
  async getMe(@ReqUser() user: UserDto): Promise<UserDto> {
    const context: ContextEntity = {
      module: UsersController.name,
      method: 'me',
    };
    this.logger.logger(user, context);
    return user;
  }

  @Put(':userId')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiResponse({
    status: 200,
    type: UpdateUserDto,
  })
  async update(
    @ReqUser() user: UserDto,
    @Body() payload: UpdateUserDto,
  ): Promise<UpdateUserDto> {
    const context: ContextEntity = {
      module: UsersController.name,
      method: 'update',
    };
    this.logger.logger(user, context);
    return await this.updateService.update(user.userId, payload);
  }
}
