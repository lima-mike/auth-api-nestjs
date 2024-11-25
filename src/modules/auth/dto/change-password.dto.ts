import { IsString, MaxLength, MinLength } from 'class-validator';

export class ChangePasswordDto {
  @IsString()
  @MinLength(8)
  @MaxLength(20)
  readonly currentPassword: string;

  @IsString()
  @MinLength(8)
  @MaxLength(20)
  readonly newPassword: string;
}
