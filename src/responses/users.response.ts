import { ApiProperty } from '@nestjs/swagger'

export class UsersResponse {
  @ApiProperty({
    example: '67609110c1688sa3jju836f2',
    description: 'The id of the user',
  })
  userId: string

  @ApiProperty({
    example: 'john_doe@gmail.com',
    description: 'The email of the user',
  })
  email: string

  @ApiProperty({
    example: 'john_doe',
    description: 'The username',
  })
  username: string
}
