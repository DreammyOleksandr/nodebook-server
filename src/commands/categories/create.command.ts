import { ICommand } from '../command.interface'
import { Model } from 'mongoose'
import { Category } from '../../categories/models/category.model'
import { CreateCategoryRequest } from '../../requests/categories.requests'

export class CreateCategoryCommand implements ICommand<Category> {
  constructor(
    private categoryModel: Model<Category>,
    private request: CreateCategoryRequest,
  ) {}

  async execute(): Promise<Category> {
    const newCategory = new this.categoryModel(this.request)
    return await newCategory.save()
  }
}
