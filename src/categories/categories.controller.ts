import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common'
import { CategoriesService } from './categories.service'
import { Category } from './models/category.model'
import { ApiOperation, ApiTags, ApiBody } from '@nestjs/swagger'
import {
  CreateCategoryRequest,
  UpdateCategoryRequest,
} from 'src/requests/categories.requests'

@ApiTags('categories')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoryService: CategoriesService) {}

  @Post()
  @ApiOperation({ summary: 'Create Category' })
  @ApiBody({ type: CreateCategoryRequest })
  async create(
    @Body() createCategoryRequest: CreateCategoryRequest,
  ): Promise<Category> {
    return this.categoryService.create(createCategoryRequest)
  }

  @Get()
  @ApiOperation({ summary: 'Get all categories' })
  async findAll(): Promise<Category[]> {
    return this.categoryService.findAll()
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get category by id' })
  async findOne(@Param('id') id: string): Promise<Category> {
    return this.categoryService.findOne(id)
  }

  @Get('/search/:name')
  @ApiOperation({ summary: 'Get categories by name' })
  async findByName(@Param('name') name: string): Promise<Category[]> {
    return this.categoryService.findByName(name)
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update category by id' })
  @ApiBody({ type: UpdateCategoryRequest })
  async update(
    @Param('id') id: string,
    @Body() updateCategoryRequest: UpdateCategoryRequest,
  ): Promise<Category> {
    return this.categoryService.update(id, updateCategoryRequest)
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete category by id' })
  async remove(@Param('id') id: string): Promise<Category> {
    return this.categoryService.remove(id)
  }
}
