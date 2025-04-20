import { ICommand } from '../command.interface'
import { Model } from 'mongoose'
import { Category } from '../../categories/models/category.model'

export class FindAllCategoriesCommand implements ICommand<Category[]> {
  constructor(private categoryModel: Model<Category>) {}

  async execute(): Promise<Category[]> {
    return await this.categoryModel.find()
  }
}
