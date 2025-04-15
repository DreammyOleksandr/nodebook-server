// search-strategies/rating-search.strategy.ts
import { FilterQuery } from 'mongoose'
import { Book } from 'src/books/models/book.model'
import { SearchStrategy } from '../search-strategy.interface'

export class RatingSearchStrategy implements SearchStrategy {
  buildQuery(params: {
    minRating?: number
    maxRating?: number
  }): FilterQuery<Book> {
    const query: FilterQuery<Book> = {}

    if (params.minRating !== undefined) {
      query.averageRating = { ...query.averageRating, $gte: params.minRating }
    }

    if (params.maxRating !== undefined) {
      query.averageRating = { ...query.averageRating, $lte: params.maxRating }
    }

    return query
  }
}
