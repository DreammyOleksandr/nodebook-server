import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsString } from 'class-validator'

export class LoginUserRequest {
  @IsEmail()
  @ApiProperty({
    example: 'john_doe@gmail.com',
    description: 'The email of the user',
  })
  username: string

  @IsString()
  @ApiProperty({
    example: 'securePassword123',
    description: 'The password of the user',
  })
  password: string
}
