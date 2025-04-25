import { FilterQuery } from 'mongoose'
import { Book } from 'src/books/models/book.model'
import { SearchStrategy } from '../search-strategy.interface'
import { BadRequestException } from '@nestjs/common'

export class AuthorSearchStrategy implements SearchStrategy {
  buildQuery(params: { author: string }): FilterQuery<Book> {
    if (!params.author || params.author.trim() === '') {
      throw new BadRequestException('Author query cannot be empty')
    }
    return {
      author: { $regex: params.author, $options: 'i' },
    }
  }
}
