import { ApiProperty } from '@nestjs/swagger'

export class CreateUserDto {
  @ApiProperty({ example: 'john_doe', description: 'The username of the user' })
  username: string

  @ApiProperty({
    example: 'securePassword123',
    description: 'The password of the user',
  })
  password: string
}
