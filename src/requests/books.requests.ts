import { ApiProperty } from '@nestjs/swagger'
import {
  IsNotEmpty,
  IsNumber,
  IsString,
  Min,
  IsOptional,
} from 'class-validator'
import { Types } from 'mongoose'

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
  @IsString()
  @ApiProperty({
    example: '607d1f77bcf86cd799439011',
    description: 'The category ID that the book belongs to',
  })
  categoryId?: string
}
