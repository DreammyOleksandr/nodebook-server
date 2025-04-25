import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { Category } from './models/category.model'
import {
  CreateCategoryRequest,
  UpdateCategoryRequest,
} from '../requests/categories.requests'
import { CreateCategoryCommand } from '../commands/categories/create.command'
import { FindAllCategoriesCommand } from '../commands/categories/find-all.command'
import { FindByNameCategoryCommand } from '../commands/categories/find-by-name.command'
import { FindOneCategoryCommand } from '../commands/categories/find-one.command'
import { RemoveCategoryCommand } from '../commands/categories/remove.command'
import { UpdateCategoryCommand } from '../commands/categories/update.command'

@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel('category') private categoryModel: Model<Category>,
  ) {}

  async create(request: CreateCategoryRequest): Promise<Category> {
    return new CreateCategoryCommand(this.categoryModel, request).execute()
  }

  async findAll(): Promise<Category[]> {
    return new FindAllCategoriesCommand(this.categoryModel).execute()
  }

  async findOne(id: string): Promise<Category> {
    return new FindOneCategoryCommand(this.categoryModel, id).execute()
  }

  async findByName(name: string): Promise<Category[]> {
    return new FindByNameCategoryCommand(this.categoryModel, name).execute()
  }

  async update(id: string, request: UpdateCategoryRequest): Promise<Category> {
    return new UpdateCategoryCommand(this.categoryModel, id, request).execute()
  }

  async remove(id: string): Promise<Category> {
    return new RemoveCategoryCommand(this.categoryModel, id).execute()
  }
}
