import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from '../../../application/dto/create-user.dto';
import { Users } from '../../models/users.schema';
import { DB_CONNECTION_NAME } from '../../../constants';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectModel(Users.name, DB_CONNECTION_NAME)
    private readonly usersModel: Model<Users>,
  ) {}

  getUserModel(): Model<Users> {
    return this.usersModel;
  }

  findEmail(email: string): Promise<Users> {
    return this.usersModel.findOne({ email });
  }

  async create(payload: CreateUserDto): Promise<Users> {
    return this.usersModel.create(payload);
  }
}