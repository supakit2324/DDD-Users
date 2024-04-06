import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { RolesEnum } from '../../infrastructure/enum/roles.enum';
export class UserDto {
  @ApiProperty({
    example: 'userId',
  })
  @IsString()
  userId?: string;

  @ApiProperty({
    example: 'email@gmail.com',
  })
  @IsString()
  email: string;

  @ApiProperty({
    example: 'username',
  })
  @IsString()
  username: string;

  @ApiProperty({
    example: 'hash',
  })
  @IsString()
  password: string;

  @ApiProperty({
    enum: RolesEnum,
    example: RolesEnum.MEMBER,
  })
  @IsString()
  roles?: string;

  @ApiProperty({
    example: 'token',
  })
  @IsString()
  token?: string;
}
