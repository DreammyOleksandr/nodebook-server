import { Module } from '@nestjs/common'
import { CategoriesController } from './categories.controller'
import { MongooseModule } from '@nestjs/mongoose'
import { CategorySchema } from './models/category.model'

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'category', schema: CategorySchema }]),
  ],
  controllers: [CategoriesController],
})
export class CategoriesModule {}
