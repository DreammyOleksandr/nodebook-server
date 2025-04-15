// search-strategies/search.context.ts
import { Injectable } from '@nestjs/common'
import { FilterQuery } from 'mongoose'
import { Book } from 'src/books/models/book.model'
import { SearchStrategy } from './search-strategy.interface'

@Injectable()
export class SearchContext {
  private strategies: SearchStrategy[] = []

  addStrategy(strategy: SearchStrategy): void {
    this.strategies.push(strategy)
  }

  buildQuery(params: any): FilterQuery<Book> {
    return this.strategies.reduce((query, strategy) => {
      return { ...query, ...strategy.buildQuery(params) }
    }, {})
  }
}
