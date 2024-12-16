import { ApiProperty } from '@nestjs/swagger'
import { UsersResponse } from './users.response'

export class AuthResponse {
  @ApiProperty()
  usersResponse: UsersResponse

  @ApiProperty({
    example: 'Something Successful happened (hopefully)',
    description: 'The authentication message',
  })
  message: string
}
