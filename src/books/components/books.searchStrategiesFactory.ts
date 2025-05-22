import { BookSearchCriteria } from '../models/book.model'
import { NameSearchStrategy } from '../../search-strategy/books/search-name.strategy'
import { AuthorSearchStrategy } from '../../search-strategy/books/search-author.strategy'
import { PageQuantitySearchStrategy } from '../../search-strategy/books/search-page-quantity.strategy'
import { RatingSearchStrategy } from '../../search-strategy/books/search-rating.strategy'
import { SearchStrategy } from '../../search-strategy/search-strategy.interface'

export class BookSearchStrategiesFactory {
  static createStrategies(criteria: BookSearchCriteria): SearchStrategy[] {
    const strategies: SearchStrategy[] = []

    if (criteria.name) {
      strategies.push(new NameSearchStrategy())
    }
    if (criteria.author) {
      strategies.push(new AuthorSearchStrategy())
    }
    if (criteria.minPages !== undefined || criteria.maxPages !== undefined) {
      strategies.push(new PageQuantitySearchStrategy())
    }
    if (criteria.minRating !== undefined || criteria.maxRating !== undefined) {
      strategies.push(new RatingSearchStrategy())
    }

    return strategies
  }
}
