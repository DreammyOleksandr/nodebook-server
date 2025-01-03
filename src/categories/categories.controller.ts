import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common'
import { CategoriesService } from './categories.service'
import { Category } from './models/category.model'
import { ApiTags } from '@nestjs/swagger'
import {
  CreateCategoryRequest,
  UpdateCategoryRequest,
} from '../requests/categories.requests'
import {
  SwaggerUpsert,
  SwaggerGet,
  SwaggerDelete,
} from '../utils/swagger/swagger.decorators'
import { CategoriesResponse } from '../responses/categories.responses'

@ApiTags('categories')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoryService: CategoriesService) {}

  @Post()
  @SwaggerUpsert('Create Category', CreateCategoryRequest, CategoriesResponse)
  async create(
    @Body() createCategoryRequest: CreateCategoryRequest,
  ): Promise<Category> {
    return await this.categoryService.create(createCategoryRequest)
  }

  @Get()
  @SwaggerGet('Get all categories', [CategoriesResponse])
  async findAll(): Promise<Category[]> {
    return await this.categoryService.findAll()
  }

  @Get(':id')
  @SwaggerGet('Get category by id', CategoriesResponse)
  async findOne(@Param('id') id: string): Promise<Category> {
    return await this.categoryService.findOne(id)
  }

  @Get('/search/:name')
  @SwaggerGet('Get categories by name', [CategoriesResponse])
  async findByName(@Param('name') name: string): Promise<Category[]> {
    return await this.categoryService.findByName(name)
  }

  @Put(':id')
  @SwaggerUpsert(
    'Update category by id',
    UpdateCategoryRequest,
    CategoriesResponse,
  )
  async update(
    @Param('id') id: string,
    @Body() updateCategoryRequest: UpdateCategoryRequest,
  ): Promise<Category> {
    return await this.categoryService.update(id, updateCategoryRequest)
  }

  @Delete(':id')
  @SwaggerDelete('Delete category by id')
  async remove(@Param('id') id: string): Promise<Category> {
    return await this.categoryService.remove(id)
  }
}
