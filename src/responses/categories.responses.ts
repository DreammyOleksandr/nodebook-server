import { ApiProperty } from '@nestjs/swagger'

export class CategoriesResponse {
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
    example: 'Science Fiction',
    description: 'The name of the category',
  })
  name: string
}
