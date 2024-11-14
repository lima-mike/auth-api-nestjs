import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength, MinLength } from 'class-validator';

export class ChangePasswordDto {
  @ApiProperty({
    example: 'oldpassword123',
    description: 'The current password of the user',
  })
  @IsString()
  @MinLength(8)
  @MaxLength(20)
  readonly currentPassword: string;

  @ApiProperty({
    example: 'newpassword123',
    description: 'The new password of the user',
    minLength: 8,
    maxLength: 20,
  })
  @IsString()
  @MinLength(8)
  @MaxLength(20)
  readonly newPassword: string;
}
