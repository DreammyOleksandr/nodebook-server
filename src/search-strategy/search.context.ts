import { Injectable } from '@nestjs/common'
import { FilterQuery } from 'mongoose'
import { Book } from '../books/models/book.model'
import { SearchStrategy } from './search-strategy.interface'

@Injectable()
export class SearchContext {
  private strategies: SearchStrategy[] = []

  addStrategies(strategies: SearchStrategy[]): void {
    this.strategies.push(...strategies)
  }

  buildQuery(params: any): FilterQuery<Book> {
    return this.strategies.reduce((query, strategy) => {
      return { ...query, ...strategy.buildQuery(params) }
    }, {})
  }
}
