import { Module } from '@nestjs/common';
import { UsersController } from '../controllers/users.controller';
import { UsersRepository } from '../../infrastructure/repository/users/users.repository';
import { CreateService } from '../../domain/services/create.service';
import { MongooseModule } from '@nestjs/mongoose';
import { model } from '../../infrastructure/models/model';
import { DB_CONNECTION_NAME } from '../../constants';
import { ConfigService } from '@nestjs/config';
import { JwtStrategy } from '../../infrastructure/guards/jwt.strategy';
import { PassportModule } from '@nestjs/passport';
import { UpdateService } from '../../domain/services/update.service';

@Module({
  imports: [
    PassportModule,
    MongooseModule.forFeature(model, DB_CONNECTION_NAME),
  ],
  controllers: [UsersController],
  providers: [
    UsersRepository,
    CreateService,
    ConfigService,
    JwtStrategy,
    UpdateService,
  ],
})
export class UserModule {}
