import { ICommand } from '../command.interface'
import { Model, isValidObjectId } from 'mongoose'
import { Category } from '../../categories/models/category.model'
import { UpdateCategoryRequest } from '../../requests/categories.requests'
import { BadRequestException, NotFoundException } from '@nestjs/common'

export class UpdateCategoryCommand implements ICommand<Category> {
  constructor(
    private categoryModel: Model<Category>,
    private id: string,
    private request: UpdateCategoryRequest,
  ) {}

  async execute(): Promise<Category> {
    if (!isValidObjectId(this.id)) {
      throw new BadRequestException('Invalid ID format')
    }

    const updated = await this.categoryModel.findByIdAndUpdate(
      this.id,
      this.request,
      { new: true },
    )

    if (!updated) {
      throw new NotFoundException(`Category with ID ${this.id} not found`)
    }

    return updated
  }
}
