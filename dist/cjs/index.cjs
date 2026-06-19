"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.js
var index_exports = {};
__export(index_exports, {
  JSONType: () => JSONType,
  TrieRouterJsonSchema: () => TrieRouterJsonSchema
});
module.exports = __toCommonJS(index_exports);

// src/json-schema.js
var JSONType = {
  STRING: "string",
  NUMBER: "number",
  INTEGER: "integer",
  BOOLEAN: "boolean",
  OBJECT: "object",
  ARRAY: "array",
  NULL: "null"
};

// src/trie-router-json-schema.js
var import_http_errors = __toESM(require("http-errors"), 1);

// src/create-ajv.js
var import_ajv_formats = __toESM(require("ajv-formats"), 1);
var import__ = __toESM(require("ajv/dist/2020.js"), 1);
function createAjv(options = {}) {
  const ajv = new import__.default({
    strictTypes: false,
    validateFormats: true,
    allowUnionTypes: true,
    allowMatchingProperties: true,
    ...options
  });
  (0, import_ajv_formats.default)(ajv);
  return ajv;
}
__name(createAjv, "createAjv");

// src/trie-router-json-schema.js
var import_js_service = require("@e22m4u/js-service");

// src/utils/create-error.js
var import_js_format = require("@e22m4u/js-format");
function createError(ctor, message, details, ...args) {
  const error = new ctor(message ? (0, import_js_format.format)(message, ...args) : void 0);
  if (details) {
    error.details = details;
  }
  return error;
}
__name(createError, "createError");

// src/trie-router-json-schema.js
var import_js_format2 = require("@e22m4u/js-format");
var import_js_trie_router = require("@e22m4u/js-trie-router");
var TrieRouterJsonSchema = class extends import_js_service.Service {
  static {
    __name(this, "TrieRouterJsonSchema");
  }
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
  _parametersValidatiors = /* @__PURE__ */ new Map();
  /**
   * Request body validators.
   *
   * Key: is `${route.method}/${route.path}`
   * Value: Ajv compiled validator
   *
   * @type {Map<string, Function>}
   */
  _requestBodyValidatiors = /* @__PURE__ */ new Map();
  /**
   * Response body validators.
   *
   * Key: is `${route.method}/${route.path}`
   * Value: Ajv compiled validator
   *
   * @type {Map<string, Function>}
   */
  _responseBodyValidatiors = /* @__PURE__ */ new Map();
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
    if (!options || typeof options !== "object" || Array.isArray(options)) {
      throw new import_js_format2.InvalidArgumentError(
        'Parameter "options" must be an Object, but %v was given.',
        options
      );
    }
    if (options.noRequestValidation !== void 0) {
      if (typeof options.noRequestValidation !== "boolean") {
        throw new import_js_format2.InvalidArgumentError(
          'Option "noRequestValidation" must be a Boolean, but %v was given.',
          options.noRequestValidation
        );
      }
    }
    if (options.noResponseValidation !== void 0) {
      if (typeof options.noResponseValidation !== "boolean") {
        throw new import_js_format2.InvalidArgumentError(
          'Option "noResponseValidation" must be a Boolean, but %v was given.',
          options.noResponseValidation
        );
      }
    }
    if (options.noParseParametersJson !== void 0) {
      if (typeof options.noParseParametersJson !== "boolean") {
        throw new import_js_format2.InvalidArgumentError(
          'Option "noParseParametersJson" must be a Boolean, but %v was given.',
          options.noParseParametersJson
        );
      }
    }
    if (options.noCoerceTypesInParameters !== void 0) {
      if (typeof options.noCoerceTypesInParameters !== "boolean") {
        throw new import_js_format2.InvalidArgumentError(
          'Option "noCoerceTypesInParameters" must be a Boolean, but %v was given.',
          options.noCoerceTypesInParameters
        );
      }
    }
    if (options.noCoerceTypesInRequestBody !== void 0) {
      if (typeof options.noCoerceTypesInRequestBody !== "boolean") {
        throw new import_js_format2.InvalidArgumentError(
          'Option "noCoerceTypesInRequestBody" must be a Boolean, but %v was given.',
          options.noCoerceTypesInRequestBody
        );
      }
    }
    if (options.noCoerceTypesInResponseBody !== void 0) {
      if (typeof options.noCoerceTypesInResponseBody !== "boolean") {
        throw new import_js_format2.InvalidArgumentError(
          'Option "noCoerceTypesInResponseBody" must be a Boolean, but %v was given.',
          options.noCoerceTypesInResponseBody
        );
      }
    }
    if (options.noDefaultValuesInParameters !== void 0) {
      if (typeof options.noDefaultValuesInParameters !== "boolean") {
        throw new import_js_format2.InvalidArgumentError(
          'Option "noDefaultValuesInParameters" must be a Boolean, but %v was given.',
          options.noDefaultValuesInParameters
        );
      }
    }
    if (options.noDefaultValuesInRequestBody !== void 0) {
      if (typeof options.noDefaultValuesInRequestBody !== "boolean") {
        throw new import_js_format2.InvalidArgumentError(
          'Option "noDefaultValuesInRequestBody" must be a Boolean, but %v was given.',
          options.noDefaultValuesInRequestBody
        );
      }
    }
    if (options.noDefaultValuesInResponseBody !== void 0) {
      if (typeof options.noDefaultValuesInResponseBody !== "boolean") {
        throw new import_js_format2.InvalidArgumentError(
          'Option "noDefaultValuesInResponseBody" must be a Boolean, but %v was given.',
          options.noDefaultValuesInResponseBody
        );
      }
    }
    this._options = options;
    const hookRegistry = this.getService(import_js_trie_router.RouterHookRegistry);
    if (!hookRegistry.hasHook(
      import_js_trie_router.RouterHookType.ON_DEFINE_ROUTE,
      onDefineRouteJsonSchemaHook
    )) {
      hookRegistry.addHook(
        import_js_trie_router.RouterHookType.ON_DEFINE_ROUTE,
        onDefineRouteJsonSchemaHook
      );
    }
    if (!options.noRequestValidation && !hookRegistry.hasHook(
      import_js_trie_router.RouterHookType.PRE_HANDLER,
      requestValidationJsonSchemaHook
    )) {
      hookRegistry.addHook(
        import_js_trie_router.RouterHookType.PRE_HANDLER,
        requestValidationJsonSchemaHook
      );
    }
    if (!options.noResponseValidation && !hookRegistry.hasHook(
      import_js_trie_router.RouterHookType.POST_HANDLER,
      responseValidationJsonSchemaHook
    )) {
      hookRegistry.addHook(
        import_js_trie_router.RouterHookType.POST_HANDLER,
        responseValidationJsonSchemaHook
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
      useDefaults: !this._options.noDefaultValuesInParameters
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
      useDefaults: !this._options.noDefaultValuesInRequestBody
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
      useDefaults: !this._options.noDefaultValuesInResponseBody
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
    if (!schema || typeof schema.$id !== "string") {
      throw new import_js_format2.InvalidArgumentError(
        'Schema must have an "$id" string property, but %v was given.',
        schema.$id
      );
    }
    this._getParametersAjvInstance().addSchema(schema);
    this._getRequestBodyAjvInstance().addSchema(schema);
    this._getResponseBodyAjvInstance().addSchema(schema);
    return this;
  }
};
function onDefineRouteJsonSchemaHook(routeDef, container) {
  if (!routeDef || typeof routeDef !== "object" || !routeDef.meta || typeof routeDef.meta !== "object" || routeDef.meta.jsonSchema === void 0 || routeDef.meta.jsonSchema === false) {
    return;
  }
  const inst = container.get(TrieRouterJsonSchema);
  const options = inst._options;
  const schemaObj = routeDef.meta.jsonSchema;
  const method = (routeDef.method || "").toUpperCase();
  const path = routeDef.path || "/";
  const routeKey = `${method}/${path}`;
  if (!options.noRequestValidation) {
    const hasParams = schemaObj.params !== void 0;
    const hasQuery = schemaObj.query !== void 0;
    const hasHeaders = schemaObj.headers !== void 0;
    const hasCookies = schemaObj.cookies !== void 0;
    if (hasParams || hasQuery || hasHeaders || hasCookies) {
      const parametersSchema = {
        type: "object",
        properties: {}
      };
      if (hasParams) {
        parametersSchema.properties.params = schemaObj.params;
      }
      if (hasQuery) {
        parametersSchema.properties.query = schemaObj.query;
      }
      if (hasHeaders) {
        parametersSchema.properties.headers = schemaObj.headers;
      }
      if (hasCookies) {
        parametersSchema.properties.cookies = schemaObj.cookies;
      }
      const validateParams = inst._getParametersAjvInstance().compile(parametersSchema);
      inst._parametersValidatiors.set(routeKey, validateParams);
    }
    if (schemaObj.body !== void 0) {
      const wrappedRequestBodySchema = {
        type: "object",
        properties: { body: schemaObj.body }
      };
      const validateRequestBody = inst._getRequestBodyAjvInstance().compile(wrappedRequestBodySchema);
      inst._requestBodyValidatiors.set(routeKey, validateRequestBody);
    }
  }
  if (!options.noResponseValidation && schemaObj.response !== void 0) {
    if (schemaObj.response === null || typeof schemaObj.response !== "object" || Array.isArray(schemaObj.response)) {
      throw new import_js_format2.InvalidArgumentError(
        'The "response" schema definition must be an Object keyed by status codes, but %v was given.',
        schemaObj.response
      );
    }
    const responseValidators = {};
    for (const [statusCode, schema] of Object.entries(schemaObj.response)) {
      const wrappedResponseSchema = {
        type: "object",
        properties: { response: schema }
      };
      responseValidators[statusCode] = inst._getResponseBodyAjvInstance().compile(wrappedResponseSchema);
    }
    if (Object.keys(responseValidators).length > 0) {
      inst._responseBodyValidatiors.set(routeKey, responseValidators);
    }
  }
}
__name(onDefineRouteJsonSchemaHook, "onDefineRouteJsonSchemaHook");
function requestValidationJsonSchemaHook(ctx) {
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
  const validateParams = inst._parametersValidatiors.get(routeKey);
  if (validateParams) {
    const reqParameters = {
      params: ctx.params,
      query: ctx.query,
      headers: ctx.headers,
      cookies: ctx.cookies
    };
    if (!options.noParseParametersJson) {
      reqParameters.params = parseJsonParameters(reqParameters.params);
      reqParameters.query = parseJsonParameters(reqParameters.query);
      reqParameters.headers = parseJsonParameters(reqParameters.headers);
      reqParameters.cookies = parseJsonParameters(reqParameters.cookies);
    }
    const isValid = validateParams(reqParameters);
    if (!isValid) {
      throw createError(
        import_http_errors.default.BadRequest,
        "Request parameters validation failed.",
        validateParams.errors
      );
    }
    if (reqParameters.params !== void 0) {
      ctx.params = reqParameters.params;
    }
    if (reqParameters.query !== void 0) {
      ctx.query = reqParameters.query;
    }
    if (reqParameters.headers !== void 0) {
      ctx.headers = reqParameters.headers;
    }
    if (reqParameters.cookies !== void 0) {
      ctx.cookies = reqParameters.cookies;
    }
  }
  const validateBody = inst._requestBodyValidatiors.get(routeKey);
  if (validateBody) {
    const bodyWrapper = { body: ctx.body };
    const isValid = validateBody(bodyWrapper);
    if (!isValid) {
      validateBody.errors.forEach((e) => {
        if (e.instancePath.startsWith("/body")) {
          e.instancePath = e.instancePath.replace("/body", "") || "/";
        }
      });
      throw createError(
        import_http_errors.default.BadRequest,
        "Request body validation failed.",
        validateBody.errors
      );
    }
    ctx.body = bodyWrapper.body;
  }
}
__name(requestValidationJsonSchemaHook, "requestValidationJsonSchemaHook");
function responseValidationJsonSchemaHook(ctx, data) {
  const schemaObject = (ctx.meta || {}).jsonSchema;
  if (!schemaObject || schemaObject === true) {
    return;
  }
  if (Buffer.isBuffer(data) || typeof data === "object" && typeof data.pipe === "function") {
    return data;
  }
  const inst = ctx.container.get(TrieRouterJsonSchema);
  const options = inst._options;
  if (options.noResponseValidation) {
    return;
  }
  const routeKey = `${ctx.route.method}/${ctx.route.path}`;
  const responseValidators = inst._responseBodyValidatiors.get(routeKey);
  if (!responseValidators) {
    return;
  }
  const statusCode = String(ctx.response.statusCode || 200);
  const statusClassLower = statusCode[0] + "xx";
  const statusClassUpper = statusCode[0] + "XX";
  const validateResponse = responseValidators[statusCode] || responseValidators[statusClassLower] || responseValidators[statusClassUpper] || responseValidators["default"] || responseValidators["DEFAULT"];
  if (validateResponse) {
    const wrappedResponse = { response: data };
    const isValid = validateResponse(wrappedResponse);
    if (!isValid) {
      validateResponse.errors.forEach((e) => {
        if (e.instancePath.startsWith("/response")) {
          e.instancePath = e.instancePath.replace("/response", "") || "/";
        }
      });
      throw createError(
        import_http_errors.default.InternalServerError,
        "Response body validation failed.",
        validateResponse.errors
      );
    }
    return wrappedResponse.response;
  }
  return;
}
__name(responseValidationJsonSchemaHook, "responseValidationJsonSchemaHook");
function parseJsonParameters(obj) {
  if (!obj || typeof obj !== "object" || Array.isArray(obj)) {
    return obj;
  }
  const result = {};
  for (const key of Object.keys(obj)) {
    const val = obj[key];
    if (typeof val === "string" && (val.startsWith("{") || val.startsWith("["))) {
      try {
        result[key] = JSON.parse(val);
      } catch {
        result[key] = val;
      }
    } else {
      result[key] = val;
    }
  }
  return result;
}
__name(parseJsonParameters, "parseJsonParameters");
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  JSONType,
  TrieRouterJsonSchema
});
