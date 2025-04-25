import { ICommand } from '../command.interface'
import { Model, isValidObjectId } from 'mongoose'
import { Category } from '../../categories/models/category.model'
import { BadRequestException, NotFoundException } from '@nestjs/common'

export class RemoveCategoryCommand implements ICommand<Category> {
  constructor(
    private categoryModel: Model<Category>,
    private id: string,
  ) {}

  async execute(): Promise<Category> {
    if (!isValidObjectId(this.id)) {
      throw new BadRequestException('Invalid ID format')
    }

    const deleted = await this.categoryModel.findByIdAndDelete(this.id)
    if (!deleted) {
      throw new NotFoundException(`Category with ID ${this.id} not found`)
    }

    return deleted
  }
}
