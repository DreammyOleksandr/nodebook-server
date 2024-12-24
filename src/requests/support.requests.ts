import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString } from 'class-validator'

export class SupportMessageRequest {
  @ApiProperty({
    example: 'User request',
    description: 'Message Subject',
  })
  @IsString()
  @IsNotEmpty()
  subject: string

  @ApiProperty({
    example: 'Everything is alright',
    description: 'Message Content',
  })
  @IsString()
  @IsNotEmpty()
  content: string
}
