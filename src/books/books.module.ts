import { Module } from '@nestjs/common'
import { BooksService } from './books.service'
import { BooksController } from './books.controller'
import { MongooseModule } from '@nestjs/mongoose'
import { BookSchema } from './models/book.model'
import { SearchContext } from '../search-strategy/search.context'

@Module({
  imports: [MongooseModule.forFeature([{ name: 'book', schema: BookSchema }])],
  controllers: [BooksController],
  providers: [BooksService, SearchContext],
})
export class BooksModule {}
