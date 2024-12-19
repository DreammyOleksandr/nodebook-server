import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty } from 'class-validator'

export class AddCommentRequest {
  @ApiProperty({
    example: 'Positive comment about the book',
    description: 'The comment for the book',
  })
  @IsNotEmpty()
  comment: string
}

export class AddRatingRequest {
  @ApiProperty({
    example: '5',
    description: 'The rating for the book',
  })
  @IsNotEmpty()
  rating: number
}
