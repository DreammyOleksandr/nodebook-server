# **Strategy Pattern**♟️ | [search-strategy директорія з кодом](../src/search-strategy/)

## Контекст проблеми 📝

У нашому додатку існує система пошуку книг за різними критеріями:

- По назві
- За автором
- За кількістю сторінок (діапазон від-до)
- За рейтингом (діапазон від-до)

## Причина використання патерну Strategy 🤔

Патерн Strategy був обраний через такі його переваги:

- Гнучкість та розширюваність

  - Ізольовані стратегії - кожен критерій пошуку реалізований в окремому класі

  - Легке додавання нових стратегій без змін існуючого коду

  - Можливість комбінувати стратегії (наприклад, пошук за автором та рейтингом одночасно)

- Чітка відповідальність

  - Кожен клас стратегії відповідає лише за один критерій пошуку

  - Простота тестування - кожну стратегію можна тестувати ізольовано

## Опис реалізації ✅

Кожна стратегія реалізує:

- Валідацію вхідних параметрів

- Побудову запиту, в залежності від обраної стратегії

- Обробку спеціальних випадків

## Приклад з коду 💻

```ts
//books/search-name.strategy.ts:
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
```

```ts
//search.context.ts:
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
    const query: FilterQuery<Book> = {}
    for (const strategy of this.strategies) {
      Object.assign(query, strategy.buildQuery(params))
    }
    return query
  }
}
```
