import { AuthController } from '../controllers/auth.controller';
import { LoginService } from '../../domain/services/login.service';
import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from '../../config/configuration';
import { MongooseModule } from '@nestjs/mongoose';
import { mongooseModuleAsyncOptions } from '../../infrastructure/database/database.providers';
import { model } from '../../infrastructure/models/model';
import { DB_CONNECTION_NAME } from '../../constants';
import { JwtStrategy } from '../../infrastructure/guards/jwt.strategy';
import { PassportModule } from '@nestjs/passport';
import { LoginDto } from '../dto/login.dto';
import { cloneDeep } from 'lodash';
import { AuthRepository } from '../../infrastructure/repository/auth/auth.repository';
import { UsersRepository } from '../../infrastructure/repository/users/users.repository';
import { JwtService } from '@nestjs/jwt';

describe('AuthController', () => {
  let controller: AuthController;
  let loginService: LoginService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        PassportModule,
        ConfigModule.forRoot({
          load: [configuration],
          isGlobal: true,
        }),
        MongooseModule.forRootAsync(mongooseModuleAsyncOptions),
        MongooseModule.forFeature(model, DB_CONNECTION_NAME),
      ],
      controllers: [AuthController],
      providers: [
        AuthController,
        LoginService,
        ConfigService,
        JwtStrategy,
        AuthRepository,
        UsersRepository,
        JwtService,
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    loginService = module.get<LoginService>(LoginService);
  });

  it('login', async () => {
    const user: LoginDto = {
      email: 'user1@gmail.com',
      password: '1234',
    };
    const loginUser = cloneDeep(user);

    jest.spyOn(loginService, 'login').mockImplementation(async () => loginUser);

    const data = await controller.login(loginUser);

    expect(data).toBeDefined();
    Object.keys(data).forEach((key) => {
      expect(data[key]).toBe(user[key]);
    });
  });
});
