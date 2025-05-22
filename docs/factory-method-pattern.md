# **Factory Pattern**🏭 | [BookSearchStrategyFactory](https://github.com/DreammyOleksandr/nodebook-server/tree/main/src/books/components/books.searchStrategyFactory.ts)

## Контекст проблеми 📝

У додатках, де пошук здійснюється за багатьма критеріями (наприклад, книги можна шукати за назвою, автором, кількістю сторінок, рейтингом тощо), часто виникає потреба динамічно формувати набір стратегій пошуку залежно від введених користувачем параметрів. Якщо додавати перевірки та логіку пошуку безпосередньо у сервіс, це призводить до надмірної складності, дублювання коду та порушення принципу відкритості/закритості (OCP).

## Причина використання патерну Factory 🤔

Factory Pattern допомагає:

- **Інкапсулювати створення об'єктів**: логіка вибору та створення потрібних стратегій пошуку винесена в окремий клас-фабрику, а не розкидана по коду.
- **Зменшити зв'язність**: сервіс не знає, які саме стратегії існують і як їх створювати.
- **Легко розширювати**: для додавання нової стратегії достатньо додати новий клас і оновити фабрику, не змінюючи основний код пошуку.
- **Дотримання принципів SOLID**: особливо принципу відкритості/закритості та єдиного обов’язку.

## Опис реалізації ✅

- **BookSearchStrategyFactory**: статичний клас, який на основі критеріїв пошуку створює масив потрібних стратегій.
- **SearchStrategy**: інтерфейс/абстрактний клас для всіх стратегій пошуку (наприклад, NameSearchStrategy, AuthorSearchStrategy, PageQuantitySearchStrategy, RatingSearchStrategy).
- **SearchContext**: клас, що агрегує стратегії та будує фінальний запит до бази даних.
- **BookService**: використовує фабрику для отримання потрібних стратегій та делегує їм побудову запиту.

## Кодова реалізація 💻

```ts
// BookSearchStrategyFactory.ts
export class BookSearchStrategyFactory {
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
```

```ts
// BookService.ts (фрагмент)
async searchBooks(criteria: BookSearchCriteria): Promise {
  this.searchContext = new SearchContext()
  const strategies = BookSearchStrategyFactory.createStrategies(criteria)
  this.searchContext.addStrategies(strategies)
  const query = this.searchContext.buildQuery(criteria)
  return this.populateBook(this.bookModel.find(query))
}
```

## Як це працює? 🛠️

1. **Користувач вводить критерії пошуку** (наприклад, ім'я автора та мінімальний рейтинг).
2. **BookSearchStrategyFactory** аналізує критерії та створює відповідні стратегії пошуку.
3. **SearchContext** отримує ці стратегії та будує фінальний запит до бази даних, комбінуючи логіку кожної стратегії.
4. **BookService** отримує результати пошуку, не знаючи деталей реалізації кожної стратегії.

## Переваги такого підходу 🌟

- **Гнучкість**: легко додати нову стратегію пошуку без зміни основного коду.
- **Читабельність**: логіка створення стратегій зосереджена в одному місці.
- **Тестованість**: кожну стратегію можна тестувати окремо.
