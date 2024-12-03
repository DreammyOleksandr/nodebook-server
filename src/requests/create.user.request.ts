import { ApiProperty } from '@nestjs/swagger'
import { IsStrongPassword, IsString, IsEmail } from 'class-validator'

export class CreateUserRequest {
  @IsEmail()
  @ApiProperty({
    example: 'john_doe@gmail.com',
    description: 'The email of the user',
  })
  email: string

  @IsString()
  @ApiProperty({ example: 'john_doe', description: 'The username of the user' })
  username: string

  @IsStrongPassword({
    minLength: 8,
    minLowercase: 1,
    minNumbers: 1,
    minSymbols: 1,
    minUppercase: 1,
  })
  @ApiProperty({
    example: 'securePassword123',
    description: 'The password of the user',
  })
  password: string
}
