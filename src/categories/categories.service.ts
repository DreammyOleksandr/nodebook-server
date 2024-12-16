import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { Category } from './models/category.model'
import {
  CreateCategoryRequest,
  UpdateCategoryRequest,
} from 'src/requests/categories.requests'

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
    return await this.categoryModel.findById(id)
  }

  async findByName(name: string): Promise<Category[]> {
    return this.categoryModel.find({
      name: { $regex: name, $options: 'i' },
    })
  }

  async update(
    id: string,
    updateCategoryRequest: UpdateCategoryRequest,
  ): Promise<Category> {
    return await this.categoryModel.findByIdAndUpdate(
      id,
      updateCategoryRequest,
      { new: true },
    )
  }

  async remove(id: string): Promise<Category> {
    return await this.categoryModel.findByIdAndDelete(id)
  }
}
