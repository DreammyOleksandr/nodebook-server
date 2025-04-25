import { FilterQuery } from 'mongoose'
import { Book } from 'src/books/models/book.model'
import { SearchStrategy } from '../search-strategy.interface'
import { BadRequestException } from '@nestjs/common'

export class NameSearchStrategy implements SearchStrategy {
  buildQuery(params: { name: string }): FilterQuery<Book> {
    if (!params.name || params.name.trim() === '') {
      throw new BadRequestException('Name query cannot be empty')
    }
    return {
      name: { $regex: params.name, $options: 'i' },
    }
  }
}
