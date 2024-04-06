import { Module } from '@nestjs/common';
import { AuthController } from '../controllers/auth.controller';
import { LoginService } from '../../domain/services/login.service';
import { AuthRepository } from '../../infrastructure/repository/auth/auth.repository';
import { UsersRepository } from '../../infrastructure/repository/users/users.repository';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { model } from '../../infrastructure/models/model';
import { DB_CONNECTION_NAME } from '../../constants';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forFeature(model, DB_CONNECTION_NAME),
    JwtModule,
    PassportModule,
  ],
  controllers: [AuthController],
  providers: [LoginService, AuthRepository, UsersRepository, JwtService],
})
export class AuthModule {}
