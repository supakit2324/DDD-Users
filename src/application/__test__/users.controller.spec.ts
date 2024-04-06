import { UsersController } from '../controllers/users.controller';
import { CreateService } from '../../domain/services/create.service';
import { Test, TestingModule } from '@nestjs/testing';
import { UsersRepository } from '../../infrastructure/repository/users/users.repository';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from '../../infrastructure/guards/jwt.strategy';
import { CreateUserDto } from '../dto/create-user.dto';
import { cloneDeep } from 'lodash';
import { MongooseModule } from '@nestjs/mongoose';
import { model } from '../../infrastructure/models/model';
import { DB_CONNECTION_NAME } from '../../constants';
import { mongooseModuleAsyncOptions } from '../../infrastructure/database/database.providers';
import configuration from '../../config/configuration';
import { UserDto } from '../dto/user.dto';
import { UpdateService } from '../../domain/services/update.service';
import { UpdateUserDto } from '../dto/update-user.dto';
import { FindUsersService } from '../../domain/services/find-users.service';
import { DeleteService } from '../../domain/services/delete.service';
describe('UserController', () => {
  let controller: UsersController;
  let createService: CreateService;
  let updateService: UpdateService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          load: [configuration],
          isGlobal: true,
        }),
        MongooseModule.forRootAsync(mongooseModuleAsyncOptions),
        MongooseModule.forFeature(model, DB_CONNECTION_NAME),
      ],
      controllers: [UsersController],
      providers: [
        UsersRepository,
        CreateService,
        ConfigService,
        JwtStrategy,
        UpdateService,
        FindUsersService,
        DeleteService,
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    createService = module.get<CreateService>(CreateService);
    updateService = module.get<UpdateService>(UpdateService);
  });

  it('create', async () => {
    const user: CreateUserDto = {
      email: 'user1@gmail.com',
      username: 'user1',
      password: '1234',
    };
    const createUser = cloneDeep(user);

    jest
      .spyOn(createService, 'create')
      .mockImplementation(async () => createUser);
    const data = await controller.create(createUser);
    expect(data).toBeDefined();
    Object.keys(data).forEach((key) => {
      expect(data[key]).toBe(user[key]);
    });
  });

  it('getMe', async () => {
    const profile: UserDto = {
      userId: 'userId',
      email: 'email@gmail.com',
      username: 'username',
      password: 'hash',
      roles: 'member',
      token: 'token',
    };

    const profileUser = cloneDeep(profile);
    jest.spyOn(controller, 'getMe').mockImplementation(async () => profileUser);
    const data = await controller.getMe(profileUser);
    expect(data).toBeDefined();
    Object.keys(data).forEach((key) => {
      expect(data[key]).toStrictEqual(profile[key]);
    });
  });

  it('update', async () => {
    const currentUser: UserDto = {
      userId: 'userId',
      email: 'email@gmail.com',
      username: 'username',
      password: 'hash',
      roles: 'member',
      token: 'token',
    };

    const update: UpdateUserDto = {
      username: 'username1',
    };

    const updatedUser: UserDto = {
      ...currentUser,
      ...update,
    };

    jest
      .spyOn(updateService, 'update')
      .mockImplementation(async (userId, payload) => {
        expect(userId).toBe(currentUser.userId);
        expect(payload).toEqual(update);
        return updatedUser;
      });

    const result = await controller.update(currentUser, update);

    expect(result).toBeDefined();
    expect(result).toEqual(updatedUser);
  });
});
