// search-strategies/search-strategy.interface.ts
import { FilterQuery } from 'mongoose'
import { Book } from '../books/models/book.model'

export interface SearchStrategy {
  buildQuery(params: any): FilterQuery<Book>
}
