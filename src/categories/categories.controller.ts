import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common'
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
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { CreateCategoryCommand } from 'src/commands/categories/create.command'
import { FindAllCategoriesCommand } from 'src/commands/categories/find-all.command'
import { FindOneCategoryCommand } from 'src/commands/categories/find-one.command'
import { FindByNameCategoryCommand } from 'src/commands/categories/find-by-name.command'
import { UpdateCategoryCommand } from 'src/commands/categories/update.command'
import { RemoveCategoryCommand } from 'src/commands/categories/remove.command'

@ApiTags('categories')
@Controller('categories')
export class CategoriesController {
  constructor(
    @InjectModel('category') private categoryModel: Model<Category>,
  ) {}

  @Post()
  @SwaggerUpsert('Create Category', CreateCategoryRequest, CategoriesResponse)
  async create(
    @Body() createCategoryRequest: CreateCategoryRequest,
  ): Promise<Category> {
    return new CreateCategoryCommand(
      this.categoryModel,
      createCategoryRequest,
    ).execute()
  }

  @Get()
  @SwaggerGet('Get all categories', [CategoriesResponse])
  async findAll(): Promise<Category[]> {
    return new FindAllCategoriesCommand(this.categoryModel).execute()
  }

  @Get(':id')
  @SwaggerGet('Get category by id', CategoriesResponse)
  async findOne(@Param('id') id: string): Promise<Category> {
    return new FindOneCategoryCommand(this.categoryModel, id).execute()
  }

  @Get('/search/:name')
  @SwaggerGet('Get categories by name', [CategoriesResponse])
  async findByName(@Param('name') name: string): Promise<Category[]> {
    return new FindByNameCategoryCommand(this.categoryModel, name).execute()
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
    return new UpdateCategoryCommand(
      this.categoryModel,
      id,
      updateCategoryRequest,
    ).execute()
  }

  @Delete(':id')
  @SwaggerDelete('Delete category by id')
  async remove(@Param('id') id: string): Promise<Category> {
    return new RemoveCategoryCommand(this.categoryModel, id).execute()
  }
}
