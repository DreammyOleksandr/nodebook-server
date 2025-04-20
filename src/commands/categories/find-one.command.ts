import { ICommand } from '../command.interface'
import { Model, isValidObjectId } from 'mongoose'
import { Category } from '../../categories/models/category.model'
import { BadRequestException, NotFoundException } from '@nestjs/common'

export class FindOneCategoryCommand implements ICommand<Category> {
  constructor(
    private categoryModel: Model<Category>,
    private id: string,
  ) {}

  async execute(): Promise<Category> {
    if (!isValidObjectId(this.id)) {
      throw new BadRequestException('Invalid ID format')
    }

    const category = await this.categoryModel.findById(this.id)
    if (!category) {
      throw new NotFoundException(`Category with ID ${this.id} not found`)
    }

    return category
  }
}
