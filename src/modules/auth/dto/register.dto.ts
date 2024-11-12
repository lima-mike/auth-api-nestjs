import { IsString } from 'class-validator';

export class RegisterDto {
  @IsString()
  readonly email: string;

  @IsString()
  readonly password: string;
}
