# **Singleton Pattern** ☝️

## Контекст проблеми 📝

У типових веб-застосунках багато сервісів мають спільну відповідальність або ж використовуються повторно в різних модулях.

Якщо створювати новий екземпляр цих сервісів кожного разу, це:

- призведе до зайвого споживання ресурсів,

- ускладнить контроль за станом сервісів,

- може створити помилки через розбіжності в даних (наприклад, кеш або конфігурація можуть бути неузгодженими).

## Причина використання патерну Singleton 🤔

У NestJS усі провайдери (сервіси, репозиторії), які позначені декоратором @Injectable() створюються як Singleton — тобто в одному екземплярі на весь застосунок або модуль.

Це означає, що:

Коли провайдер інжектиться через конструктор, NestJS підставляє той самий об'єкт, а не створює новий.

- Ми можемо зберігати спільні дані в сервісах, і вони будуть доступні в усіх місцях, де вони використовується.

- Це зменшує навантаження на систему (наприклад, не створює зайві підключення до бази).

## Переваги використання ✅

- Економія ресурсів
- Зручність управління
- Спільний стан
- Простота тестування

## Приклад в коді 💻

```ts
//Імпорти
@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel('category') private categoryModel: Model<Category>,
  ) {}
  //Методи класу
}
```
