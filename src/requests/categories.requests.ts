import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsOptional } from 'class-validator'

export class CreateCategoryRequest {
  @ApiProperty({
    example: 'Science Fiction',
    description: 'Name of the category',
  })
  @IsNotEmpty()
  name: string
}

export class UpdateCategoryRequest {
  @IsOptional()
  @IsNotEmpty()
  @ApiProperty({
    example: 'Science Fiction',
    description: 'Name of the category',
  })
  name?: string
}
