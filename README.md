## @e22m4u/js-trie-router-json-schema

Модуль валидации данных для
[@e22m4u/js-trie-router](https://www.npmjs.com/package/@e22m4u/js-trie-router)

- Поддержка стандарта [*JSON Schema Draft 2020-12*](https://json-schema.org/draft/2020-12/json-schema-core).
- Под капотом используется быстрый [*Ajv*](https://www.npmjs.com/package/ajv) валидатор.
- Проверка схем в момент определения.
- Проверка данных запроса и тела ответа.
- Приведение типов данных согласно схеме.
- Удаление лишних полей не объявленных в схеме.
- Автоматическая подстановка значений по умолчанию.
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

Определение спецификации для данных маршрута.

```js
import {HttpMethod} from '@e22m4u/js-trie-router';
import {JSONType} from '@e22m4u/js-trie-router-json-schema';

// определение маршрута
router.defineRoute({
  method: HttpMethod.POST,
  path: '/cities/:id',
  meta: {
    // спецификация
    jsonSchema: {
      // параметры пути
      params: {
        type: JSONType.OBJECT,
        properties: {
          // параметр "id" типа "number"
          id: {type: JSONType.NUMBER},
        },
        // параметр "id" является обязательным
        required: ['id'],
      },
      // query параметры
      query: {
        type: JSONType.OBJECT,
        properties: {
          // параметр "include" типа "array"
          // с элементами типа "string"
          include: {
            type: JSONType.ARRAY,
            items: {type: JSONType}
          },
        }
      },
      // заголовки запроса
      headers: {
        type: JSONType.OBJECT,
        properties: {
          // заголовок "authorization" типа "string"
          authorization: {type: JSONType.STRING},
          // заголовки требуется указывать в нижнем регистре
        },
      },
      // параметры Cookie заголовка
      cookies: {
        type: JSONType.OBJECT,
        properties: {
          // параметр "accessToken" типа "string"
          accessToken: {type: JSONType.STRING},
        },
      },
      // тело запроса
      body: {type: JSONType.OBJECT},
      // тело ответа
      response: {
        200: {type: JSONType.OBJECT},
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

Использование зарегистрированных схем.

```js
import {HttpMethod} from '@e22m4u/js-trie-router';
import {JSONType, TrieRouterJsonSchema} from '@e22m4u/js-trie-router-json-schema';

// извлечение расширения
const schemaService = router.getService(TrieRouterJsonSchema);

// определение именованной схемы
schemaService.defineSchema({
  $id: 'city',
  type: JSONType.OBJECT,
  properties: {
    id: {
      type: JSONType.STRING,
      format: 'uuid',
    },
    name: {
      type: JSONType.STRING,
      example: 'Moscow',
    },
    population: {
      type: JSONType.NUMBER,
      default: 0,
    },
  },
  required: ['name'],
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
