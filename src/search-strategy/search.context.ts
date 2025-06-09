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
    const query: FilterQuery<Book> = {}
    for (const strategy of this.strategies) {
      Object.assign(query, strategy.buildQuery(params))
    }
    return query
  }
}
