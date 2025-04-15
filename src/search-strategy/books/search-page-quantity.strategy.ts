// search-strategies/page-quantity-search.strategy.ts
import { FilterQuery } from 'mongoose'
import { Book } from 'src/books/models/book.model'
import { SearchStrategy } from '../search-strategy.interface'

export class PageQuantitySearchStrategy implements SearchStrategy {
  buildQuery(params: {
    minPages?: number
    maxPages?: number
  }): FilterQuery<Book> {
    const query: FilterQuery<Book> = {}

    if (params.minPages !== undefined) {
      query.pageQuantity = { ...query.pageQuantity, $gte: params.minPages }
    }

    if (params.maxPages !== undefined) {
      query.pageQuantity = { ...query.pageQuantity, $lte: params.maxPages }
    }

    return query
  }
}
