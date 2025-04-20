import { ICommand } from '../command.interface'
import { Model } from 'mongoose'
import { Category } from '../../categories/models/category.model'

export class FindByNameCategoryCommand implements ICommand<Category[]> {
  constructor(
    private categoryModel: Model<Category>,
    private name: string,
  ) {}

  async execute(): Promise<Category[]> {
    return await this.categoryModel.find({
      name: { $regex: this.name, $options: 'i' },
    })
  }
}
