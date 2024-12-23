import { ApiProperty } from '@nestjs/swagger'
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsStrongPassword,
} from 'class-validator'

export class CreateUserRequest {
  @ApiProperty({
    example: 'john_doe@gmail.com',
    description: 'Email of the user',
  })
  @IsEmail()
  email: string

  @ApiProperty({
    example: 'john_doe',
    description: 'Name of the user',
  })
  @IsNotEmpty()
  username: string

  @IsStrongPassword({
    minLength: 8,
    minLowercase: 1,
    minNumbers: 1,
    minSymbols: 1,
    minUppercase: 1,
  })
  @ApiProperty({
    example: 'SecurePassword123',
    description: 'Password of the user',
  })
  password: string
}

export class LoginUserRequest {
  @IsNotEmpty()
  @ApiProperty({
    example: 'john_doe@gmail.com',
    description: 'Email of the user',
  })
  email: string

  @IsNotEmpty()
  @IsStrongPassword({
    minLength: 8,
    minLowercase: 1,
    minNumbers: 1,
    minSymbols: 1,
    minUppercase: 1,
  })
  @ApiProperty({
    example: 'SecurePassword123',
    description: 'Password of the user',
  })
  password: string
}

export class UpdateUserRequest {
  @IsOptional()
  @IsEmail()
  @ApiProperty({
    example: 'john_doe@gmail.com',
    description: 'Email of the user',
  })
  email?: string

  @IsOptional()
  @ApiProperty({
    example: 'john_doe',
    description: 'Name of the user',
  })
  username?: string

  @IsOptional()
  @IsStrongPassword({
    minLength: 8,
    minLowercase: 1,
    minNumbers: 1,
    minSymbols: 1,
    minUppercase: 1,
  })
  @ApiProperty({
    example: 'SecurePassword123',
    description: 'Password of the user',
  })
  password?: string
}
