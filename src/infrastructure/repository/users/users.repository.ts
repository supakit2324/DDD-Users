import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from '../../../application/dto/create-user.dto';
import { Users } from '../../models/users.schema';
import { DB_CONNECTION_NAME } from '../../../constants';
import { UpdateUserDto } from '../../../application/dto/update-user.dto';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectModel(Users.name, DB_CONNECTION_NAME)
    private readonly usersModel: Model<Users>,
  ) {}

  getUserModel(): Model<Users> {
    return this.usersModel;
  }

  find(): Promise<Users[]> {
    return this.usersModel.find().lean();
  }

  findEmail(email: string): Promise<Users> {
    return this.usersModel.findOne({ email });
  }

  create(payload: CreateUserDto): Promise<Users> {
    return this.usersModel.create(payload);
  }

  update(userId: string, payload: UpdateUserDto): Promise<Users> {
    return this.usersModel.findOneAndUpdate(
      { userId },
      { username: payload.username },
    );
  }

  delete(userId: string): Promise<Users> {
    return this.usersModel.findOneAndDelete({ userId });
  }
}
