# **Builder Pattern** 🏗️ | [BookSearchCriteriaBuilder](https://github.com/DreammyOleksandr/nodebook-server/tree/main/src/books/models/book.model.ts)

## Контекст проблеми 📝

У нашому додатку є потреба виконувати гнучкий пошук книг за різними критеріями, які можуть бути як присутні, так і відсутні у запиті користувача:

- Назва книги
- Автор
- Мінімальна/максимальна кількість сторінок
- Мінімальний/максимальний рейтинг

Ці критерії є необов’язковими, і їх комбінація може бути будь-якою.

## Причина використання патерну Builder 🤔

Патерн **Builder** був обраний через такі його переваги:

- **Гнучкість у створенні складних об’єктів**
  - Дозволяє поступово налаштовувати об’єкт із багатьма необов’язковими параметрами.
- **Зручний та читабельний API**
  - Ланцюжковий виклик (chaining) методів для встановлення параметрів.
- **Ізоляція логіки побудови**
  - Вся логіка перевірки та встановлення параметрів зосереджена в одному місці.
- **Захист від некоректних станів**
  - Можна додати додаткову валідацію чи обробку дефолтних значень.

## Опис реалізації ✅

- **BookSearchCriteriaBuilder** — клас, який інкапсулює логіку поступового налаштування критеріїв пошуку.
- Кожен метод встановлює відповідний параметр, якщо він переданий, і повертає this для підтримки ланцюжка викликів.
- Метод **build()** повертає фінальний об’єкт критеріїв, очищаючи його від невизначених значень.

## Приклад з коду 💻

```ts
export type BookSearchCriteria = {
  name?: string
  author?: string
  minPages?: number
  maxPages?: number
  minRating?: number
  maxRating?: number
}

export class BookSearchCriteriaBuilder {
  private criteria: BookSearchCriteria = {}

  setName(name?: string): this {
    if (name) this.criteria.name = name
    return this
  }

  setAuthor(author?: string): this {
    if (author) this.criteria.author = author
    return this
  }

  setMinPages(minPages?: number): this {
    if (minPages !== undefined) this.criteria.minPages = minPages
    return this
  }

  setMaxPages(maxPages?: number): this {
    if (maxPages !== undefined) this.criteria.maxPages = maxPages
    return this
  }

  setMinRating(minRating?: number): this {
    if (minRating !== undefined) this.criteria.minRating = minRating
    return this
  }

  setMaxRating(maxRating?: number): this {
    if (maxRating !== undefined) this.criteria.maxRating = maxRating
    return this
  }

  build(): BookSearchCriteria {
    const criteria = { ...this.criteria }
    return Object.fromEntries(
      Object.entries(criteria).filter(([, v]) => v !== undefined),
    )
  }
}
```

### Використання у контролері

```ts
@Get()
@SwaggerGet('Get all Books or search books', [BooksResponse])
async findRange(@Query() searchParams: SearchBooksRequest): Promise {
  const searchCriteria = new BookSearchCriteriaBuilder()
    .setName(searchParams.name)
    .setAuthor(searchParams.author)
    .setMinPages(searchParams.minPages)
    .setMaxPages(searchParams.maxPages)
    .setMinRating(searchParams.minRating)
    .setMaxRating(searchParams.maxRating)
    .build()

  return Object.keys(searchCriteria).length > 0
    ? this.booksService.searchBooks(searchCriteria)
    : this.booksService.findAll()
}
```

## Переваги Builder у цьому випадку 🌟

- **Легко додавати нові критерії** — достатньо додати новий метод у Builder.
- **Зрозумілий та чистий код** — виклик у контролері виглядає лаконічно та очевидно.
- **Гарантія коректності** — лише валідні критерії потрапляють у фінальний об’єкт.
