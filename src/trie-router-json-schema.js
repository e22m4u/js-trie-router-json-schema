import HttpErrors from 'http-errors';
import {JsonType} from './json-schema.js';
import {createAjv} from './create-ajv.js';
import {Service} from '@e22m4u/js-service';
import {createError} from './utils/create-error.js';
import {InvalidArgumentError} from '@e22m4u/js-format';
import {RouterHookType, RouterHookRegistry} from '@e22m4u/js-trie-router';

/**
 * Trie router json schema.
 */
export class TrieRouterJsonSchema extends Service {
  /**
   * Options.
   */
  _options = {};

  /**
   * Parameters validators.
   *
   * Key: is `${route.method}/${route.path}`
   * Value: Ajv compiled validator
   *
   * @type {Map<string, Function>}
   */
  _parametersValidators = new Map();

  /**
   * Request body validators.
   *
   * Key: is `${route.method}/${route.path}`
   * Value: Ajv compiled validator
   *
   * @type {Map<string, Function>}
   */
  _requestBodyValidators = new Map();

  /**
   * Response body validators.
   *
   * Key: is `${route.method}/${route.path}`
   * Value: Ajv compiled validator
   *
   * @type {Map<string, Function>}
   */
  _responseBodyValidators = new Map();

  /**
   * Parameters ajv.
   *
   * @type {import('ajv/dist/2020.js').Ajv2020|undefined}
   */
  _parametersAjv;

  /**
   * Request body ajv.
   *
   * @type {import('ajv/dist/2020.js').Ajv2020|undefined}
   */
  _requestBodyAjv;

  /**
   * Response body ajv.
   *
   * @type {import('ajv/dist/2020.js').Ajv2020|undefined}
   */
  _responseBodyAjv;

  /**
   * Constructor.
   *
   * @param {import('@e22m4u/js-service').ServiceContainer} [container]
   * @param {object} [options]
   */
  constructor(container, options = {}) {
    super(container);
    // options
    if (!options || typeof options !== 'object' || Array.isArray(options)) {
      throw new InvalidArgumentError(
        'Parameter "options" must be an Object, but %v was given.',
        options,
      );
    }
    // options.noRequestValidation
    if (options.noRequestValidation !== undefined) {
      if (typeof options.noRequestValidation !== 'boolean') {
        throw new InvalidArgumentError(
          'Option "noRequestValidation" must be a Boolean, but %v was given.',
          options.noRequestValidation,
        );
      }
    }
    // options.noResponseValidation
    if (options.noResponseValidation !== undefined) {
      if (typeof options.noResponseValidation !== 'boolean') {
        throw new InvalidArgumentError(
          'Option "noResponseValidation" must be a Boolean, but %v was given.',
          options.noResponseValidation,
        );
      }
    }
    // options.noParseParametersJson
    if (options.noParseParametersJson !== undefined) {
      if (typeof options.noParseParametersJson !== 'boolean') {
        throw new InvalidArgumentError(
          'Option "noParseParametersJson" must be a Boolean, but %v was given.',
          options.noParseParametersJson,
        );
      }
    }
    // options.noCoerceTypesInParameters
    if (options.noCoerceTypesInParameters !== undefined) {
      if (typeof options.noCoerceTypesInParameters !== 'boolean') {
        throw new InvalidArgumentError(
          'Option "noCoerceTypesInParameters" must be a Boolean, but %v was given.',
          options.noCoerceTypesInParameters,
        );
      }
    }
    // options.noCoerceTypesInRequestBody
    if (options.noCoerceTypesInRequestBody !== undefined) {
      if (typeof options.noCoerceTypesInRequestBody !== 'boolean') {
        throw new InvalidArgumentError(
          'Option "noCoerceTypesInRequestBody" must be a Boolean, but %v was given.',
          options.noCoerceTypesInRequestBody,
        );
      }
    }
    // options.noCoerceTypesInResponseBody
    if (options.noCoerceTypesInResponseBody !== undefined) {
      if (typeof options.noCoerceTypesInResponseBody !== 'boolean') {
        throw new InvalidArgumentError(
          'Option "noCoerceTypesInResponseBody" must be a Boolean, but %v was given.',
          options.noCoerceTypesInResponseBody,
        );
      }
    }
    // options.noDefaultValuesInParameters
    if (options.noDefaultValuesInParameters !== undefined) {
      if (typeof options.noDefaultValuesInParameters !== 'boolean') {
        throw new InvalidArgumentError(
          'Option "noDefaultValuesInParameters" must be a Boolean, but %v was given.',
          options.noDefaultValuesInParameters,
        );
      }
    }
    // options.noDefaultValuesInRequestBody
    if (options.noDefaultValuesInRequestBody !== undefined) {
      if (typeof options.noDefaultValuesInRequestBody !== 'boolean') {
        throw new InvalidArgumentError(
          'Option "noDefaultValuesInRequestBody" must be a Boolean, but %v was given.',
          options.noDefaultValuesInRequestBody,
        );
      }
    }
    // options.noDefaultValuesInResponseBody
    if (options.noDefaultValuesInResponseBody !== undefined) {
      if (typeof options.noDefaultValuesInResponseBody !== 'boolean') {
        throw new InvalidArgumentError(
          'Option "noDefaultValuesInResponseBody" must be a Boolean, but %v was given.',
          options.noDefaultValuesInResponseBody,
        );
      }
    }
    this._options = options;
    const hookRegistry = this.getService(RouterHookRegistry);
    // в момент определения маршрута компилируются
    // валидаторы согласно спецификации из метаданных
    if (
      !hookRegistry.hasHook(
        RouterHookType.ON_DEFINE_ROUTE,
        onDefineRouteJsonSchemaHook,
      )
    ) {
      hookRegistry.addHook(
        RouterHookType.ON_DEFINE_ROUTE,
        onDefineRouteJsonSchemaHook,
      );
    }
    // если требуется проверка данных входящего запроса,
    // то выполняется регистрация "preHandler" хука
    if (
      !options.noRequestValidation &&
      !hookRegistry.hasHook(
        RouterHookType.PRE_HANDLER,
        requestValidationJsonSchemaHook,
      )
    ) {
      hookRegistry.addHook(
        RouterHookType.PRE_HANDLER,
        requestValidationJsonSchemaHook,
      );
    }
    // если требуется проверка данных ответа сервера,
    // то выполняется регистрация "postHandler" хука
    if (
      !options.noResponseValidation &&
      !hookRegistry.hasHook(
        RouterHookType.POST_HANDLER,
        responseValidationJsonSchemaHook,
      )
    ) {
      hookRegistry.addHook(
        RouterHookType.POST_HANDLER,
        responseValidationJsonSchemaHook,
      );
    }
  }

  /**
   * Get parameters Ajv instance.
   *
   * @returns {import('ajv/dist/2020.js').Ajv2020}
   */
  _getParametersAjvInstance() {
    if (this._parametersAjv) {
      return this._parametersAjv;
    }
    this._parametersAjv = createAjv({
      coerceTypes: !this._options.noCoerceTypesInParameters,
      removeAdditional: true,
      useDefaults: !this._options.noDefaultValuesInParameters,
    });
    return this._parametersAjv;
  }

  /**
   * Get request body Ajv instance.
   *
   * @returns {import('ajv/dist/2020.js').Ajv2020}
   */
  _getRequestBodyAjvInstance() {
    if (this._requestBodyAjv) {
      return this._requestBodyAjv;
    }
    this._requestBodyAjv = createAjv({
      coerceTypes: !this._options.noCoerceTypesInRequestBody,
      removeAdditional: true,
      useDefaults: !this._options.noDefaultValuesInRequestBody,
    });
    return this._requestBodyAjv;
  }

  /**
   * Get response body Ajv instance.
   *
   * @returns {import('ajv/dist/2020.js').Ajv2020}
   */
  _getResponseBodyAjvInstance() {
    if (this._responseBodyAjv) {
      return this._responseBodyAjv;
    }
    this._responseBodyAjv = createAjv({
      coerceTypes: !this._options.noCoerceTypesInResponseBody,
      removeAdditional: true,
      useDefaults: !this._options.noDefaultValuesInResponseBody,
    });
    return this._responseBodyAjv;
  }

  /**
   * Define schema.
   *
   * @param {object} schema
   * @returns {this}
   */
  defineSchema(schema) {
    if (!schema || typeof schema !== 'object' || Array.isArray(schema)) {
      throw new InvalidArgumentError(
        'Schema must be an Object, but %v was given.',
        schema,
      );
    }
    if (!schema.$id || typeof schema.$id !== 'string') {
      throw new InvalidArgumentError(
        'Schema must have an "$id" property as a non-empty String, ' +
          'but %v was given.',
        schema.$id,
      );
    }
    this._getParametersAjvInstance().addSchema(schema);
    this._getRequestBodyAjvInstance().addSchema(schema);
    this._getResponseBodyAjvInstance().addSchema(schema);
    return this;
  }
}

/**
 * On define route.
 *
 * @param {import('@e22m4u/js-trie-router').RouteDefinition} routeDef
 * @param {import('@e22m4u/js-service').ServiceContainer} container
 */
export function onDefineRouteJsonSchemaHook(routeDef, container) {
  if (
    !routeDef ||
    typeof routeDef !== 'object' ||
    !routeDef.meta ||
    typeof routeDef.meta !== 'object' ||
    routeDef.meta.jsonSchema === undefined ||
    routeDef.meta.jsonSchema === false
  ) {
    return;
  }
  const inst = container.get(TrieRouterJsonSchema);
  const options = inst._options;
  const schemaObj = routeDef.meta.jsonSchema;
  // формирование уникального ключа маршрута
  const method = (routeDef.method || '').toUpperCase();
  const path = routeDef.path || '/';
  const routeKey = `${method}/${path}`;
  // компиляция схем входящих данных запроса
  if (!options.noRequestValidation) {
    const hasParams = schemaObj.params !== undefined;
    const hasQuery = schemaObj.query !== undefined;
    const hasHeaders = schemaObj.headers !== undefined;
    const hasCookies = schemaObj.cookies !== undefined;
    // объединение params, query, headers, cookies в единую
    // структуру объекта параметров
    if (hasParams || hasQuery || hasHeaders || hasCookies) {
      const parametersSchema = {
        type: 'object',
        properties: {},
      };
      if (hasParams) {
        parametersSchema.properties.params = schemaObj.params;
      }
      if (hasQuery) {
        parametersSchema.properties.query = schemaObj.query;
      }
      if (hasHeaders) {
        parametersSchema.properties.headers = schemaObj.headers;
        // предполагается, что разработчик всегда
        // указывает заголовки в нижнем регистре
      }
      if (hasCookies) {
        parametersSchema.properties.cookies = schemaObj.cookies;
      }
      // компиляция схемы параметров
      const validateParams = inst
        ._getParametersAjvInstance()
        .compile(parametersSchema);
      inst._parametersValidators.set(routeKey, validateParams);
    }
    // компиляция схемы тела запроса
    if (schemaObj.body !== undefined) {
      // для корректного приведения типа примитивов,
      // схема тела оборачивается в схему объека
      const wrappedRequestBodySchema = {
        type: 'object',
        properties: {body: schemaObj.body},
        required: ['body'],
      };
      const validateRequestBody = inst
        ._getRequestBodyAjvInstance()
        .compile(wrappedRequestBodySchema);
      inst._requestBodyValidators.set(routeKey, validateRequestBody);
    }
  }
  // компиляция схем тела ответа
  if (!options.noResponseValidation && schemaObj.responses !== undefined) {
    if (
      schemaObj.responses === null ||
      typeof schemaObj.responses !== 'object' ||
      Array.isArray(schemaObj.responses)
    ) {
      throw new InvalidArgumentError(
        'The "responses" schema definition must be an Object ' +
          'keyed by status codes, but %v was given.',
        schemaObj.responses,
      );
    }
    const responseValidators = {};
    for (const [statusCode, schema] of Object.entries(schemaObj.responses)) {
      const wrappedResponseSchema = {
        type: 'object',
        properties: {response: schema},
        required: ['response'],
      };
      responseValidators[statusCode] = inst
        ._getResponseBodyAjvInstance()
        .compile(wrappedResponseSchema);
    }
    if (Object.keys(responseValidators).length > 0) {
      inst._responseBodyValidators.set(routeKey, responseValidators);
    }
  }
}

/**
 * Pre-handler hook.
 *
 * @type {import('@e22m4u/js-trie-router').PreHandlerHook}
 */
export function requestValidationJsonSchemaHook(ctx) {
  const schemaObject = (ctx.meta || {}).jsonSchema;
  if (!schemaObject || schemaObject === true) {
    return;
  }
  const inst = ctx.container.get(TrieRouterJsonSchema);
  const options = inst._options;
  if (options.noRequestValidation) {
    return;
  }
  const routeKey = `${ctx.route.method}/${ctx.route.path}`;
  // валидация параметров (params, query, headers, cookies)
  const validateParams = inst._parametersValidators.get(routeKey);
  if (validateParams) {
    const reqParameters = {
      params: ctx.params,
      query: ctx.query,
      headers: ctx.headers,
      cookies: ctx.cookies,
    };
    // парсинг строковых значений,
    // похожих на массивы или объекты
    if (!options.noParseParametersJson) {
      const ajv = inst._getParametersAjvInstance();
      reqParameters.params = parseJsonParameters(
        reqParameters.params,
        schemaObject.params,
        ajv,
      );
      reqParameters.query = parseJsonParameters(
        reqParameters.query,
        schemaObject.query,
        ajv,
      );
      reqParameters.headers = parseJsonParameters(
        reqParameters.headers,
        schemaObject.headers,
        ajv,
      );
      reqParameters.cookies = parseJsonParameters(
        reqParameters.cookies,
        schemaObject.cookies,
        ajv,
      );
    }
    const isValid = validateParams(reqParameters);
    if (!isValid) {
      throw createError(
        HttpErrors.BadRequest,
        'Request parameters validation failed.',
        validateParams.errors,
      );
    }
    // ajv мутирует объект reqParameters, выполняет приведение
    // типов, удаление лишние поля и устанавливает дефолтные значения,
    // поэтому нужно вернуть новые значения обратно в контекст
    if (reqParameters.params !== undefined) {
      ctx.params = reqParameters.params;
    }
    if (reqParameters.query !== undefined) {
      ctx.query = reqParameters.query;
    }
    if (reqParameters.headers !== undefined) {
      ctx.headers = reqParameters.headers;
    }
    if (reqParameters.cookies !== undefined) {
      ctx.cookies = reqParameters.cookies;
    }
  }
  // валидация тела запроса
  const validateBody = inst._requestBodyValidators.get(routeKey);
  if (validateBody) {
    const bodyWrapper = {body: ctx.body};
    const isValid = validateBody(bodyWrapper);
    if (!isValid) {
      throw createError(
        HttpErrors.BadRequest,
        'Request body validation failed.',
        validateBody.errors,
      );
    }
    // возвращение данных в контекст, так как ajv валидатор
    // мог мутировать объект (например, приведение типов
    // или добавление значений по умолчанию)
    ctx.body = bodyWrapper.body;
  }
}

/**
 * Post-handler hook.
 *
 * @type {import('@e22m4u/js-trie-router').PostHandlerHook}
 */
export function responseValidationJsonSchemaHook(ctx, data) {
  const schemaObject = (ctx.meta || {}).jsonSchema;
  if (!schemaObject || schemaObject === true) {
    return;
  }
  // если контроллер вернет поток или буфер, ajv попытается
  // проверить этот сложный объект по JSON-схеме, и это приведет
  // к ошибкам валидации или падению приложения
  if (
    Buffer.isBuffer(data) ||
    (typeof data === 'object' && typeof data.pipe === 'function')
  ) {
    return;
  }
  const inst = ctx.container.get(TrieRouterJsonSchema);
  const options = inst._options;
  if (options.noResponseValidation) {
    return;
  }
  const routeKey = `${ctx.route.method}/${ctx.route.path}`;
  const responseValidators = inst._responseBodyValidators.get(routeKey);
  if (!responseValidators) {
    return;
  }
  // если статус явно не установлен в обработчике,
  // по спецификации HTTP по умолчанию используется 200
  const statusCode = String(ctx.response.statusCode || 200);
  const statusClassLower = statusCode[0] + 'xx'; // например: 2xx
  const statusClassUpper = statusCode[0] + 'XX'; // например: 2XX
  // поиск подходящего валидатора по приоритетам:
  // 1. точное совпадение (например, "200")
  // 2. совпадение по классу (например, "2xx" или "2XX")
  // 3. значение по умолчанию ("default" или "DEFAULT")
  const validateResponse =
    responseValidators[statusCode] ||
    responseValidators[statusClassLower] ||
    responseValidators[statusClassUpper] ||
    responseValidators['default'] ||
    responseValidators['DEFAULT'];
  if (validateResponse) {
    const wrappedResponse = {response: data};
    const isValid = validateResponse(wrappedResponse);
    if (!isValid) {
      throw createError(
        HttpErrors.InternalServerError,
        'Response body validation failed.',
        validateResponse.errors,
      );
    }
    // возвращение данных, так как ajv валидатор мог мутировать объект
    // (например, приведение типов или добавление значений по умолчанию)
    return wrappedResponse.response;
  }
  return;
}

/**
 * Parse JSON parameters based on JSON Schema types.
 *
 * @param {object|undefined} params Объект параметров запроса.
 * @param {object|undefined} schema Схема объекта параметров.
 * @param {import('ajv/dist/2020.js').Ajv2020|undefined} ajv Требуется для разрешения $ref.
 * @returns {object|undefined}
 */
export function parseJsonParameters(params, schema, ajv) {
  if (!params || typeof params !== 'object' || Array.isArray(params)) {
    return params;
  }
  const result = {};
  // извелчение объекта "properties" из схемы
  // (если присутствует)
  const properties =
    (schema &&
      typeof schema === 'object' &&
      !Array.isArray(schema) &&
      schema.properties &&
      typeof schema.properties === 'object' &&
      !Array.isArray(schema.properties) &&
      schema.properties) ||
    undefined;
  for (const key of Object.keys(params)) {
    const val = params[key];
    const valStr = typeof val === 'string' ? val.trim() : '';
    // если объект "properties" определен, то выполняется
    // извлечение схемы конкретного свойства
    const propSchema = (properties && properties[key]) || undefined;
    // тип определяется как напрямую (propSchema.type), так и через
    // резолв $ref-ссылки на уже зарегистрированную в Ajv схему
    const resolvedType = resolveSchemaType(propSchema, ajv);
    const types = resolvedType
      ? Array.isArray(resolvedType)
        ? resolvedType
        : [resolvedType]
      : [];
    const expectsObject = types.includes(JsonType.OBJECT);
    const expectsArray = types.includes(JsonType.ARRAY);
    if (
      valStr &&
      ((expectsObject && valStr.startsWith('{') && valStr.endsWith('}')) ||
        (expectsArray && valStr.startsWith('[') && valStr.endsWith(']')))
    ) {
      try {
        result[key] = JSON.parse(valStr);
      } catch {
        result[key] = val;
      }
    } else {
      result[key] = val;
    }
  }
  return result;
}

/**
 * Определить ключевое слово "type" схемы, следуя по локальным
 * ссылкам $ref, зарегистрированным в переданном экземпляре Ajv.
 * Используется, так как ссылающаяся схема `{$ref: 'foo'}` сама
 * по себе не содержит "type", ведь он находится в целевой схеме.
 *
 * @param {object|undefined} schema
 * @param {import('ajv/dist/2020.js').Ajv2020|undefined} ajv
 * @param {number} [depth]
 * @returns {string|string[]|undefined}
 */
export function resolveSchemaType(schema, ajv, depth = 0) {
  if (!schema || typeof schema !== 'object' || Array.isArray(schema)) {
    return undefined;
  }
  if (schema.type) {
    return schema.type;
  }
  // защита от цикличных или чрезмерно длинных цепочек ссылок
  if (!schema.$ref || !ajv || depth >= 10) {
    return undefined;
  }
  const resolved = ajv.getSchema(schema.$ref);
  if (!resolved || !resolved.schema) {
    return undefined;
  }
  return resolveSchemaType(resolved.schema, ajv, depth + 1);
}
