import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import {
  IsNotEmpty,
  IsNumber,
  IsString,
  Min,
  IsOptional,
  Max,
} from 'class-validator'
import { Types } from 'mongoose'

export class SearchBooksRequest {
  @ApiPropertyOptional({
    description: 'Filter by book name (case insensitive)',
    example: 'Harry Potter',
  })
  @IsOptional()
  @IsString()
  name?: string

  @ApiPropertyOptional({
    description: 'Filter by author name (case insensitive)',
    example: 'J.K. Rowling',
  })
  @IsOptional()
  @IsString()
  author?: string

  @ApiPropertyOptional({
    description: 'Minimum number of pages',
    example: 100,
    type: Number,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  minPages?: number

  @ApiPropertyOptional({
    description: 'Maximum number of pages',
    example: 500,
    type: Number,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  maxPages?: number

  @ApiPropertyOptional({
    description: 'Minimum average rating (1-5)',
    example: 4,
    type: Number,
    minimum: 1,
    maximum: 5,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(5)
  minRating?: number

  @ApiPropertyOptional({
    description: 'Maximum average rating (1-5)',
    example: 5,
    type: Number,
    minimum: 1,
    maximum: 5,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(5)
  maxRating?: number
}

export class CreateBookRequest {
  @ApiProperty({
    example: 'Dune',
    description: 'The name of the book',
  })
  @IsNotEmpty()
  name: string

  @ApiProperty({
    example: 412,
    description: 'The page count of the book',
  })
  @IsNumber()
  @Min(1)
  pageQuantity: number

  @ApiProperty({
    example: 'Frank Herbert',
    description: 'The author of the book',
  })
  @IsNotEmpty()
  author: string

  @IsOptional()
  @ApiProperty({
    example: 'Description',
    description: 'The description of the book',
  })
  @IsNotEmpty()
  description: string

  @ApiProperty({
    example: '607d1f77bcf86cd799439011',
    description: 'The category ID that the book belongs to',
  })
  @IsNotEmpty()
  categoryId: Types.ObjectId
}

export class UpdateBookRequest {
  @IsOptional()
  @IsString()
  @ApiProperty({
    example: 'Dune',
    description: 'The name of the book',
  })
  name?: string

  @IsOptional()
  @IsNumber()
  @Min(1)
  @ApiProperty({
    example: 412,
    description: 'The page count of the book',
  })
  pageQuantity?: number

  @IsOptional()
  @IsString()
  @ApiProperty({
    example: 'Frank Herbert',
    description: 'The author of the book',
  })
  author?: string

  @IsOptional()
  @ApiProperty({
    example: 'Description',
    description: 'The description of the book',
  })
  @IsNotEmpty()
  description: string

  @IsOptional()
  @IsString()
  @ApiProperty({
    example: '607d1f77bcf86cd799439011',
    description: 'The category ID that the book belongs to',
  })
  categoryId?: string
}
