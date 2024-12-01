import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'

export class LoginUserRequest {
  @IsString()
  @ApiProperty({ example: 'john_doe', description: 'The username of the user' })
  username: string

  @IsString()
  @ApiProperty({
    example: 'securePassword123',
    description: 'The password of the user',
  })
  password: string
}
