import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { AuthBody } from '../interfaces/auth.interface';

export class AuthDTO implements AuthBody {
  @ApiProperty()
  @IsNotEmpty()
  username: string;
  
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  password: string;
}
