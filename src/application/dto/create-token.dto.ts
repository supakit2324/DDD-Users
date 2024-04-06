import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTokenDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: 'token',
  })
  token: string;
}
