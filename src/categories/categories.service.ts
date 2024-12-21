import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model, isValidObjectId } from 'mongoose'
import { Category } from './models/category.model'
import {
  CreateCategoryRequest,
  UpdateCategoryRequest,
} from '../requests/categories.requests'

@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel('category') private categoryModel: Model<Category>,
  ) {}

  async create(
    createCategoryRequest: CreateCategoryRequest,
  ): Promise<Category> {
    const newCategory = new this.categoryModel(createCategoryRequest)
    return await newCategory.save()
  }

  async findAll(): Promise<Category[]> {
    return await this.categoryModel.find()
  }

  async findOne(id: string): Promise<Category> {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('Invalid ID format')
    }

    const category = await this.categoryModel.findById(id)
    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`)
    }
    return category
  }

  async findByName(name: string): Promise<Category[]> {
    return await this.categoryModel.find({
      name: { $regex: name, $options: 'i' },
    })
  }

  async update(
    id: string,
    updateCategoryRequest: UpdateCategoryRequest,
  ): Promise<Category> {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('Invalid ID format')
    }

    const updatedCategory = await this.categoryModel.findByIdAndUpdate(
      id,
      updateCategoryRequest,
      { new: true },
    )
    if (!updatedCategory) {
      throw new NotFoundException(`Category with ID ${id} not found`)
    }
    return updatedCategory
  }

  async remove(id: string): Promise<Category> {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('Invalid ID format')
    }

    const deletedCategory = await this.categoryModel.findByIdAndDelete(id)
    if (!deletedCategory) {
      throw new NotFoundException(`Category with ID ${id} not found`)
    }

    return deletedCategory
  }
}
