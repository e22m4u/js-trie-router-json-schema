## @e22m4u/js-trie-router-json-schema

Модуль валидации данных для
[@e22m4u/js-trie-router](https://www.npmjs.com/package/@e22m4u/js-trie-router)

- Поддержка стандарта [*JSON Schema Draft 2020-12*](https://json-schema.org/draft/2020-12/json-schema-core).
- Под капотом используется быстрый валидатор [*Ajv*](https://www.npmjs.com/package/ajv).
- Проверка схем в момент определения.
- Проверка данных запроса и тела ответа.
- Приведение типов данных согласно схеме (ключ `type`).
- Удаление неизвестных полей при указании `additionalProperties: false`.
- Автоматическая подстановка значений по умолчанию (ключ `default`).
- Автоматический парсинг *JSON* в параметрах запроса.

## Содержание

- [Установка](#установка)
- [Использование](#использование)
- [Настройки](#настройки)
- [Тесты](#тесты)
- [Лицензия](#лицензия)

## Установка

```bash
npm install @e22m4u/js-trie-router-json-schema
```

Модуль поддерживает ESM и CommonJS стандарты.

*ESM*

```js
import {TrieRouterJsonSchema} from '@e22m4u/js-trie-router-json-schema';
```

*CommonJS*

```js
const {TrieRouterJsonSchema} = require('@e22m4u/js-trie-router-json-schema');
```

## Использование

Подключение модуля к маршрутизатору.

```js
import {TrieRouter} from '@e22m4u/js-trie-router';
import {TrieRouterJsonSchema} from '@e22m4u/js-trie-router-json-schema';

// создание маршрутизатора
const router = new TrieRouter();

// подключение расширения
router.useService(TrieRouterJsonSchema);
```

Определение *JSON* схемы для данных запроса и ответа.

```js
import {HttpMethod} from '@e22m4u/js-trie-router';
import {JsonType} from '@e22m4u/js-trie-router-json-schema';

// определение маршрута
router.defineRoute({
  method: HttpMethod.POST,
  path: '/cities/:id',
  meta: {
    // спецификация
    jsonSchema: {
      // параметры пути
      params: {
        type: JsonType.OBJECT,
        properties: {
          id: {type: JsonType.NUMBER},
        },
        required: ['id'],
      },
      // query параметры
      query: {
        type: JsonType.OBJECT,
        properties: {
          include: {
            type: JsonType.ARRAY,
            items: {type: JsonType}
          },
        }
      },
      // заголовки запроса
      headers: {
        type: JsonType.OBJECT,
        properties: {
          // (!) заголовки требуется указывать в нижнем регистре
          authorization: {type: JsonType.STRING},
        },
      },
      // параметры заголовка Cookie
      cookies: {
        type: JsonType.OBJECT,
        properties: {
          accessToken: {type: JsonType.STRING},
        },
      },
      // тело запроса
      body: {type: JsonType.OBJECT},
      // тело ответа
      response: {
        200: {type: JsonType.OBJECT},
      },
    },
  },
  handler: (ctx) => {
    // ctx.params.id
    // ctx.query.include
    // ctx.headers.authorization (заголовки в нижнем регистре)
    // ctx.cookies.accessToken
    // ctx.body
    // ...
  },
});
```

Использование зарегистрированной схемы (ключ `$ref`).

```js
import {HttpMethod} from '@e22m4u/js-trie-router';
import {JsonType, TrieRouterJsonSchema} from '@e22m4u/js-trie-router-json-schema';

// извлечение расширения
const schemaService = router.getService(TrieRouterJsonSchema);

// регистрация именованной схемы
schemaService.defineSchema({
  $id: 'city',
  type: JsonType.OBJECT,
  properties: {
    id: {
      type: JsonType.STRING,
      format: 'uuid',
    },
    name: {
      type: JsonType.STRING,
      example: ['Moscow'],
    },
    population: {
      type: JsonType.NUMBER,
      default: 0,
    },
  },
  required: ['name'],
  additionalProperties: false, // удалять неизвестные поля
});

// определение маршрута
router.defineRoute({
  method: HttpMethod.POST,
  path: '/cities',
  meta: {
    jsonSchema: {
      body: {$ref: 'city'},  // ссылка на схему
      response: {
        200: {$ref: 'city'}, // ссылка на схему
      },
    },
  },
  handler: (ctx) => {
    // ...
  },
});
```

## Настройки

При подключении данного расширения вторым аргументом можно определить
параметры валидации, как это показано в примере ниже.

```js
import {TrieRouter} from '@e22m4u/js-trie-router';
import {TrieRouterJsonSchema} from '@e22m4u/js-trie-router-json-schema';

const router = new TrieRouter();

router.useService(TrieRouterJsonSchema, {
  // параметры со значениями по умолчанию
  noRequestValidation: false,
  noResponseValidation: false,
  noParseParametersJson: false,
  noCoerceTypesInParameters: false,
  noCoerceTypesInRequestBody: false,
  noCoerceTypesInResponseBody: false,
  noDefaultValuesInParameters: false,
  noDefaultValuesInRequestBody: false,
  noDefaultValuesInResponseBody: false,
});
```

Приведение типов и установка значений по умолчанию не будет выполняться,
если валидация отключена.

## Тесты

```bash
npm run test
```

## Лицензия

MIT
