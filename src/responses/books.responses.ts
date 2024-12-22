import { ApiProperty } from '@nestjs/swagger'
import { CategoriesResponse } from './categories.responses'

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
    example: 'Description',
    description: 'The description of the book',
  })
  description: string

  @ApiProperty({
    example: CategoriesResponse,
    description: 'The category ID that the book belongs to',
  })
  categoryId: CategoriesResponse

  @ApiProperty({
    example: 4.5,
    description: 'The average rating of the book',
  })
  averageRating: number
}
