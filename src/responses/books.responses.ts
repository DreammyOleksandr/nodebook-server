import { ApiProperty } from '@nestjs/swagger'
import { Types } from 'mongoose'

export class BooksResponse {
  @ApiProperty({
    example: '67609110c1688sa3jju836f2',
    description: 'The id of the book',
  })
  _id: string

  @ApiProperty({
    example: '1',
    description: 'The version key of the book',
  })
  __v: number

  @ApiProperty({
    example: 'Dune',
    description: 'The name of the book',
  })
  name: string

  @ApiProperty({
    example: 412,
    description: 'The page count of the book',
  })
  pageQuantity: number

  @ApiProperty({
    example: 'Frank Herbert',
    description: 'The author of the book',
  })
  author: string

  @ApiProperty({
    example: '607d1f77bcf86cd799439011',
    description: 'The category ID that the book belongs to',
  })
  categoryId: Types.ObjectId

  @ApiProperty({
    example: 4.5,
    description: 'The average rating of the book',
  })
  averageRating: number
}
