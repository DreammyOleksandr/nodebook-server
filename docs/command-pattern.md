# **Command Pattern**🔉 | [commands директорія з кодом](../src/commands/)

## Контекст проблеми 📝

У багатьох додатках реалізація бізнес-логіки для різних операцій може призвести до повторюваного коду та надмірної складності в обробці кожної операції. Зокрема, у сервісах, які обробляють CRUD-операції (Create, Read, Update, Delete), існує необхідність централізовано обробляти та розширювати кожну з цих операцій, при цьому зберігаючи їх гнучкість і тестованість.

## Причина використання патерну Command 🤔

Патерн Command допомагає:

- Розділити відповідальність: кожна операція в додатку стає окремою командою, яка інкапсулює всю необхідну логіку для виконання цієї операції.

- Спрощення тестування: кожна команда має чітко визначену операцію, що дозволяє легко створювати тести для кожної з них.

- Легкість розширення: нові операції можна додавати, створюючи нові класи команд без змін у сервісах чи контролерах.

- Гнучкість і змінність: можна додавати нові типи команд, змінювати спосіб їх виконання або додавати додаткові етапи в команду, не впливаючи на решту додатка.

- Підтримка принципів SOLID: командний патерн сприяє дотриманню принципів інкапсуляції та розділення обов'язків, що робить додаток більш підтримуваним.

## Опис реалізації ✅

[Інтерфейс ICommand](../src/commands/command.interface.ts): він визначає метод execute(), який має бути реалізований у кожній команді.

Команди: для кожної операції в сервісі створюється окремий клас, який реалізує інтерфейс ICommand:

- CreateCategoryCommand: створює нову категорію.

- FindAllCategoriesCommand: знаходить всі категорії.

- FindOneCategoryCommand: знаходить категорію за ID.

- FindByNameCategoryCommand: шукає категорії за іменем.

- UpdateCategoryCommand: оновлює категорію.

- RemoveCategoryCommand: видаляє категорію.

[Сервіс](../src/categories/categories.service.ts): у сервісі ми створюємо екземпляри цих команд та викликаємо їх метод execute() для виконання необхідної операції. Сервіс тепер виконує лише роль координатора, делегуючи роботу конкретним командам.

## Кодова реалізація 💻

```ts
//categories.service.ts
//Імпорти
@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel('category') private categoryModel: Model<Category>,
  ) {}

  async create(request: CreateCategoryRequest): Promise<Category> {
    return new CreateCategoryCommand(this.categoryModel, request).execute()
  }

  async findAll(): Promise<Category[]> {
    return new FindAllCategoriesCommand(this.categoryModel).execute()
  }

  async findOne(id: string): Promise<Category> {
    return new FindOneCategoryCommand(this.categoryModel, id).execute()
  }

  async findByName(name: string): Promise<Category[]> {
    return new FindByNameCategoryCommand(this.categoryModel, name).execute()
  }

  async update(id: string, request: UpdateCategoryRequest): Promise<Category> {
    return new UpdateCategoryCommand(this.categoryModel, id, request).execute()
  }

  async remove(id: string): Promise<Category> {
    return new RemoveCategoryCommand(this.categoryModel, id).execute()
  }
}
```

```ts
//command.interface.ts
export interface ICommand<T> {
  execute(): Promise<T>
}
```

```ts
//create.command.ts
//Імпорти
export class CreateCategoryCommand implements ICommand<Category> {
  constructor(
    private categoryModel: Model<Category>,
    private request: CreateCategoryRequest,
  ) {}

  async execute(): Promise<Category> {
    const newCategory = new this.categoryModel(this.request)
    return await newCategory.save()
  }
}
```
