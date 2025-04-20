# **Global Exception Filter (Handler) Pattern**♟️ | [http-exception.filter.ts файл з кодом](../src/filters/http-exception.filter.ts)

## Контекст проблеми 📝

Цей патерн вирішує проблему неструктурованої обробки помилок у застосунку.

## Причина використання патерну Global Exception Filter 🤔

Патерн Global Exception Filter був обраний через такі його переваги:

- Централізована обробка помилок: Замість того, щоб писати обробку помилок у кожному сервісі, фільтр забезпечує єдине місце для керування тим, як помилки логуються та повертаються клієнту.

- Однаковий формат помилок: Клієнти отримують передбачувану, структуровану відповідь.

- Зручність дебагу: Можна додати логування, щоб бачити всі помилки в одному місці.

- Обробка неочікуваних винятків: Якщо виникне помилка, яка не є HttpException (наприклад, просто throw 'Error'), фільтр все одно надасть чисту та інформативну відповідь.

## Опис реалізації ✅

Exception Filter:

- Перехоплює всі винятки в застосунку (оскільки @Catch() не має аргументів — це фільтр, який ловить усе).

- Визначає HTTP-статус код залежно від типу винятку.

- Отримує повідомлення з винятку або використовує 'Internal server error' як значення за замовчуванням.

- Формує та відправляє уніфіковану JSON-відповідь, яка містить:

  - statusCode

  - timestamp

  - path (URL запиту)

  - error (повідомлення про помилку)

## Кодова реалізація 💻

```ts
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common'
import { Request, Response } from 'express'

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    console.log(exception)
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()
    const request = ctx.getRequest<Request>()

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR

    const message =
      exception instanceof HttpException
        ? exception.getResponse()
        : 'Internal server error'

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      error: typeof message === 'string' ? message : message['message'],
    })
  }
}
```
