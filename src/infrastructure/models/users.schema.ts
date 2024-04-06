import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { RolesEnum } from '../enum/roles.enum';
@Schema({
  collection: 'users',
  timestamps: true,
  versionKey: false,
})
export class Users extends Document {
  @Prop({
    type: String,
    index: true,
    unique: true,
    default: () => uuidv4(),
  })
  userId?: string;

  @Prop({
    type: String,
    index: true,
    unique: true,
    required: true,
  })
  email: string;

  @Prop({
    type: String,
    index: true,
    required: true,
  })
  username: string;

  @Prop({
    type: String,
    required: true,
  })
  password: string;

  @Prop({
    type: String,
    enum: RolesEnum,
    default: RolesEnum.MEMBER,
  })
  roles?: RolesEnum;

  @Prop({
    type: String,
    default: null,
  })
  token?: string;
}
export const UsersSchema = SchemaFactory.createForClass(Users);
