import {expect} from 'chai';
import {Readable} from 'stream';
import HttpErrors from 'http-errors';
import {format} from '@e22m4u/js-format';
import {JsonType} from './json-schema.js';
import {createAjv} from './create-ajv.js';
import {ServiceContainer} from '@e22m4u/js-service';
import {RouterHookRegistry, RouterHookType} from '@e22m4u/js-trie-router';

import {
  resolveSchemaType,
  parseJsonParameters,
  TrieRouterJsonSchema,
  onDefineRouteJsonSchemaHook,
  requestValidationJsonSchemaHook,
  responseValidationJsonSchemaHook,
} from './trie-router-json-schema.js';

describe('TrieRouterJsonSchema', function () {
  describe('constructor', function () {
    it('should pass the given container to the super class', function () {
      const container = new ServiceContainer();
      const S = new TrieRouterJsonSchema(container);
      expect(S.container).to.be.eq(container);
    });

    it('should require the parameter "options" to be an Object', function () {
      const throwable = v => () => {
        new TrieRouterJsonSchema(undefined, v);
      };
      const error = s =>
        format('Parameter "options" must be an Object, but %s was given.', s);
      expect(throwable('str')).to.throw(error('"str"'));
      expect(throwable('')).to.throw(error('""'));
      expect(throwable(10)).to.throw(error('10'));
      expect(throwable(0)).to.throw(error('0'));
      expect(throwable(true)).to.throw(error('true'));
      expect(throwable(false)).to.throw(error('false'));
      expect(throwable([])).to.throw(error('Array'));
      expect(throwable(null)).to.throw(error('null'));
      throwable({})();
      throwable(undefined)();
    });

    it('should require the option "noRequestValidation" to be a Boolean', function () {
      const throwable = v => () => {
        new TrieRouterJsonSchema(undefined, {noRequestValidation: v});
      };
      const error = s =>
        format(
          'Option "noRequestValidation" must be a Boolean, but %s was given.',
          s,
        );
      expect(throwable('str')).to.throw(error('"str"'));
      expect(throwable('')).to.throw(error('""'));
      expect(throwable(10)).to.throw(error('10'));
      expect(throwable(0)).to.throw(error('0'));
      expect(throwable([])).to.throw(error('Array'));
      expect(throwable({})).to.throw(error('Object'));
      expect(throwable(null)).to.throw(error('null'));
      throwable(true)();
      throwable(false)();
      throwable(undefined)();
    });

    it('should require the option "noResponseValidation" to be a Boolean', function () {
      const throwable = v => () => {
        new TrieRouterJsonSchema(undefined, {noResponseValidation: v});
      };
      const error = s =>
        format(
          'Option "noResponseValidation" must be a Boolean, but %s was given.',
          s,
        );
      expect(throwable('str')).to.throw(error('"str"'));
      expect(throwable('')).to.throw(error('""'));
      expect(throwable(10)).to.throw(error('10'));
      expect(throwable(0)).to.throw(error('0'));
      expect(throwable([])).to.throw(error('Array'));
      expect(throwable({})).to.throw(error('Object'));
      expect(throwable(null)).to.throw(error('null'));
      throwable(true)();
      throwable(false)();
      throwable(undefined)();
    });

    it('should require the option "noParseParametersJson" to be a Boolean', function () {
      const throwable = v => () => {
        new TrieRouterJsonSchema(undefined, {noParseParametersJson: v});
      };
      const error = s =>
        format(
          'Option "noParseParametersJson" must be a Boolean, but %s was given.',
          s,
        );
      expect(throwable('str')).to.throw(error('"str"'));
      expect(throwable('')).to.throw(error('""'));
      expect(throwable(10)).to.throw(error('10'));
      expect(throwable(0)).to.throw(error('0'));
      expect(throwable([])).to.throw(error('Array'));
      expect(throwable({})).to.throw(error('Object'));
      expect(throwable(null)).to.throw(error('null'));
      throwable(true)();
      throwable(false)();
      throwable(undefined)();
    });

    it('should require the option "noCoerceTypesInParameters" to be a Boolean', function () {
      const throwable = v => () => {
        new TrieRouterJsonSchema(undefined, {noCoerceTypesInParameters: v});
      };
      const error = s =>
        format(
          'Option "noCoerceTypesInParameters" must be a Boolean, but %s was given.',
          s,
        );
      expect(throwable('str')).to.throw(error('"str"'));
      expect(throwable('')).to.throw(error('""'));
      expect(throwable(10)).to.throw(error('10'));
      expect(throwable(0)).to.throw(error('0'));
      expect(throwable([])).to.throw(error('Array'));
      expect(throwable({})).to.throw(error('Object'));
      expect(throwable(null)).to.throw(error('null'));
      throwable(true)();
      throwable(false)();
      throwable(undefined)();
    });

    it('should require the option "noCoerceTypesInRequestBody" to be a Boolean', function () {
      const throwable = v => () => {
        new TrieRouterJsonSchema(undefined, {noCoerceTypesInRequestBody: v});
      };
      const error = s =>
        format(
          'Option "noCoerceTypesInRequestBody" must be a Boolean, but %s was given.',
          s,
        );
      expect(throwable('str')).to.throw(error('"str"'));
      expect(throwable('')).to.throw(error('""'));
      expect(throwable(10)).to.throw(error('10'));
      expect(throwable(0)).to.throw(error('0'));
      expect(throwable([])).to.throw(error('Array'));
      expect(throwable({})).to.throw(error('Object'));
      expect(throwable(null)).to.throw(error('null'));
      throwable(true)();
      throwable(false)();
      throwable(undefined)();
    });

    it('should require the option "noCoerceTypesInResponseBody" to be a Boolean', function () {
      const throwable = v => () => {
        new TrieRouterJsonSchema(undefined, {noCoerceTypesInResponseBody: v});
      };
      const error = s =>
        format(
          'Option "noCoerceTypesInResponseBody" must be a Boolean, but %s was given.',
          s,
        );
      expect(throwable('str')).to.throw(error('"str"'));
      expect(throwable('')).to.throw(error('""'));
      expect(throwable(10)).to.throw(error('10'));
      expect(throwable(0)).to.throw(error('0'));
      expect(throwable([])).to.throw(error('Array'));
      expect(throwable({})).to.throw(error('Object'));
      expect(throwable(null)).to.throw(error('null'));
      throwable(true)();
      throwable(false)();
      throwable(undefined)();
    });

    it('should require the option "noDefaultValuesInParameters" to be a Boolean', function () {
      const throwable = v => () => {
        new TrieRouterJsonSchema(undefined, {noDefaultValuesInParameters: v});
      };
      const error = s =>
        format(
          'Option "noDefaultValuesInParameters" must be a Boolean, but %s was given.',
          s,
        );
      expect(throwable('str')).to.throw(error('"str"'));
      expect(throwable('')).to.throw(error('""'));
      expect(throwable(10)).to.throw(error('10'));
      expect(throwable(0)).to.throw(error('0'));
      expect(throwable([])).to.throw(error('Array'));
      expect(throwable({})).to.throw(error('Object'));
      expect(throwable(null)).to.throw(error('null'));
      throwable(true)();
      throwable(false)();
      throwable(undefined)();
    });

    it('should require the option "noDefaultValuesInRequestBody" to be a Boolean', function () {
      const throwable = v => () => {
        new TrieRouterJsonSchema(undefined, {noDefaultValuesInRequestBody: v});
      };
      const error = s =>
        format(
          'Option "noDefaultValuesInRequestBody" must be a Boolean, but %s was given.',
          s,
        );
      expect(throwable('str')).to.throw(error('"str"'));
      expect(throwable('')).to.throw(error('""'));
      expect(throwable(10)).to.throw(error('10'));
      expect(throwable(0)).to.throw(error('0'));
      expect(throwable([])).to.throw(error('Array'));
      expect(throwable({})).to.throw(error('Object'));
      expect(throwable(null)).to.throw(error('null'));
      throwable(true)();
      throwable(false)();
      throwable(undefined)();
    });

    it('should require the option "noDefaultValuesInResponseBody" to be a Boolean', function () {
      const throwable = v => () => {
        new TrieRouterJsonSchema(undefined, {noDefaultValuesInResponseBody: v});
      };
      const error = s =>
        format(
          'Option "noDefaultValuesInResponseBody" must be a Boolean, but %s was given.',
          s,
        );
      expect(throwable('str')).to.throw(error('"str"'));
      expect(throwable('')).to.throw(error('""'));
      expect(throwable(10)).to.throw(error('10'));
      expect(throwable(0)).to.throw(error('0'));
      expect(throwable([])).to.throw(error('Array'));
      expect(throwable({})).to.throw(error('Object'));
      expect(throwable(null)).to.throw(error('null'));
      throwable(true)();
      throwable(false)();
      throwable(undefined)();
    });

    it('should store valid options in the "_options" property', function () {
      const container = new ServiceContainer();
      const options = {
        noRequestValidation: true,
        noResponseValidation: false,
        noParseParametersJson: true,
      };
      const S = new TrieRouterJsonSchema(container, options);
      expect(S._options).to.be.eql(options);
    });

    it('should register "onDefineRouteJsonSchemaHook" in the hook registry', function () {
      const container = new ServiceContainer();
      new TrieRouterJsonSchema(container);
      const registry = container.get(RouterHookRegistry);
      const hasHook = registry.hasHook(
        RouterHookType.ON_DEFINE_ROUTE,
        onDefineRouteJsonSchemaHook,
      );
      expect(hasHook).to.be.true;
    });

    it('should register "requestValidationJsonSchemaHook" if "noRequestValidation" is false or undefined', function () {
      const container = new ServiceContainer();
      new TrieRouterJsonSchema(container);
      const registry = container.get(RouterHookRegistry);
      const hasHook = registry.hasHook(
        RouterHookType.PRE_HANDLER,
        requestValidationJsonSchemaHook,
      );
      expect(hasHook).to.be.true;
    });

    it('should NOT register "requestValidationJsonSchemaHook" if "noRequestValidation" is true', function () {
      const container = new ServiceContainer();
      new TrieRouterJsonSchema(container, {noRequestValidation: true});
      const registry = container.get(RouterHookRegistry);
      const hasHook = registry.hasHook(
        RouterHookType.PRE_HANDLER,
        requestValidationJsonSchemaHook,
      );
      expect(hasHook).to.be.false;
    });

    it('should register "responseValidationJsonSchemaHook" if "noResponseValidation" is false or undefined', function () {
      const container = new ServiceContainer();
      new TrieRouterJsonSchema(container);
      const registry = container.get(RouterHookRegistry);
      const hasHook = registry.hasHook(
        RouterHookType.POST_HANDLER,
        responseValidationJsonSchemaHook,
      );
      expect(hasHook).to.be.true;
    });

    it('should NOT register "responseValidationJsonSchemaHook" if "noResponseValidation" is true', function () {
      const container = new ServiceContainer();
      new TrieRouterJsonSchema(container, {noResponseValidation: true});
      const registry = container.get(RouterHookRegistry);
      const hasHook = registry.hasHook(
        RouterHookType.POST_HANDLER,
        responseValidationJsonSchemaHook,
      );
      expect(hasHook).to.be.false;
    });
  });

  describe('_getParametersAjvInstance', function () {
    it('should return the same Ajv instance on subsequent calls', function () {
      const S = new TrieRouterJsonSchema();
      const res1 = S._getParametersAjvInstance();
      const res2 = S._getParametersAjvInstance();
      expect(res1).to.be.an('object');
      expect(res1).to.be.eq(res2);
    });

    it('should create an Ajv instance with correct default options', function () {
      const container = new ServiceContainer();
      const S = new TrieRouterJsonSchema(container);
      const ajv = S._getParametersAjvInstance();
      expect(ajv.opts.coerceTypes).to.be.true;
      expect(ajv.opts.useDefaults).to.be.true;
      expect(ajv.opts.removeAdditional).to.be.true;
    });

    it('should create an Ajv instance respecting custom options', function () {
      const container = new ServiceContainer();
      const S = new TrieRouterJsonSchema(container, {
        noCoerceTypesInParameters: true,
        noDefaultValuesInParameters: true,
      });
      const ajv = S._getParametersAjvInstance();
      expect(ajv.opts.coerceTypes).to.be.false;
      expect(ajv.opts.useDefaults).to.be.false;
      expect(ajv.opts.removeAdditional).to.be.true;
    });
  });

  describe('_getRequestBodyAjvInstance', function () {
    it('should return the same Ajv instance on subsequent calls', function () {
      const S = new TrieRouterJsonSchema();
      const res1 = S._getRequestBodyAjvInstance();
      const res2 = S._getRequestBodyAjvInstance();
      expect(res1).to.be.an('object');
      expect(res1).to.be.eq(res2);
    });

    it('should create an Ajv instance with correct default options', function () {
      const container = new ServiceContainer();
      const S = new TrieRouterJsonSchema(container);
      const ajv = S._getRequestBodyAjvInstance();
      expect(ajv.opts.coerceTypes).to.be.true;
      expect(ajv.opts.useDefaults).to.be.true;
      expect(ajv.opts.removeAdditional).to.be.true;
    });

    it('should create an Ajv instance respecting custom options', function () {
      const container = new ServiceContainer();
      const S = new TrieRouterJsonSchema(container, {
        noCoerceTypesInRequestBody: true,
        noDefaultValuesInRequestBody: true,
      });
      const ajv = S._getRequestBodyAjvInstance();
      expect(ajv.opts.coerceTypes).to.be.false;
      expect(ajv.opts.useDefaults).to.be.false;
      expect(ajv.opts.removeAdditional).to.be.true;
    });
  });

  describe('_getResponseBodyAjvInstance', function () {
    it('should return the same Ajv instance on subsequent calls', function () {
      const S = new TrieRouterJsonSchema();
      const res1 = S._getResponseBodyAjvInstance();
      const res2 = S._getResponseBodyAjvInstance();
      expect(res1).to.be.an('object');
      expect(res1).to.be.eq(res2);
    });

    it('should create an Ajv instance with correct default options', function () {
      const container = new ServiceContainer();
      const S = new TrieRouterJsonSchema(container);
      const ajv = S._getResponseBodyAjvInstance();
      expect(ajv.opts.coerceTypes).to.be.true;
      expect(ajv.opts.useDefaults).to.be.true;
      expect(ajv.opts.removeAdditional).to.be.true;
    });

    it('should create an Ajv instance respecting custom options', function () {
      const container = new ServiceContainer();
      const S = new TrieRouterJsonSchema(container, {
        noCoerceTypesInResponseBody: true,
        noDefaultValuesInResponseBody: true,
      });
      const ajv = S._getResponseBodyAjvInstance();
      expect(ajv.opts.coerceTypes).to.be.false;
      expect(ajv.opts.useDefaults).to.be.false;
      expect(ajv.opts.removeAdditional).to.be.true;
    });
  });

  describe('defineSchema', function () {
    it('should require the parameter "schema" to be an Object', function () {
      const S = new TrieRouterJsonSchema();
      const throwable = v => () => S.defineSchema(v);
      const error = v =>
        format('Schema must be an Object, but %s was given.', v);
      expect(throwable('str')).to.throw(error('"str"'));
      expect(throwable('')).to.throw(error('""'));
      expect(throwable(10)).to.throw(error('10'));
      expect(throwable(0)).to.throw(error('0'));
      expect(throwable(true)).to.throw(error('true'));
      expect(throwable(false)).to.throw(error('false'));
      expect(throwable([])).to.throw(error('Array'));
      expect(throwable(undefined)).to.throw(error('undefined'));
      expect(throwable(null)).to.throw(error('null'));
    });

    it('should require the schema to have an "$id" property as a non-empty String', function () {
      const S = new TrieRouterJsonSchema();
      const throwable = v => () => S.defineSchema({$id: v});
      const error = v =>
        format(
          'Schema must have an "$id" property as a non-empty String, ' +
            'but %s was given.',
          v,
        );
      expect(throwable('')).to.throw(error('""'));
      expect(throwable(10)).to.throw(error('10'));
      expect(throwable(0)).to.throw(error('0'));
      expect(throwable(true)).to.throw(error('true'));
      expect(throwable(false)).to.throw(error('false'));
      expect(throwable([])).to.throw(error('Array'));
      expect(throwable({})).to.throw(error('Object'));
      expect(throwable(undefined)).to.throw(error('undefined'));
      expect(throwable(null)).to.throw(error('null'));
    });

    it('should register the schema in all Ajv instances', function () {
      const S = new TrieRouterJsonSchema();
      const mySchema = {
        $id: 'MyTestSchema',
        type: 'object',
        properties: {foo: {type: 'string'}},
      };
      S.defineSchema(mySchema);
      const paramsValidator =
        S._getParametersAjvInstance().getSchema('MyTestSchema');
      const reqBodyValidator =
        S._getRequestBodyAjvInstance().getSchema('MyTestSchema');
      const resBodyValidator =
        S._getResponseBodyAjvInstance().getSchema('MyTestSchema');
      expect(paramsValidator).to.be.a('function');
      expect(reqBodyValidator).to.be.a('function');
      expect(resBodyValidator).to.be.a('function');
    });

    it('should return the current instance for chaining', function () {
      const S = new TrieRouterJsonSchema();
      const mySchema = {$id: 'MyChainSchema', type: 'object'};
      const result = S.defineSchema(mySchema);
      expect(result).to.be.eq(S);
    });
  });

  describe('onDefineRouteJsonSchemaHook', function () {
    it('should ignore if the route definition is invalid or lacks the "jsonSchema" keyword', function () {
      const container = new ServiceContainer();
      const S = container.get(TrieRouterJsonSchema);
      onDefineRouteJsonSchemaHook(undefined, container);
      onDefineRouteJsonSchemaHook(null, container);
      onDefineRouteJsonSchemaHook('str', container);
      onDefineRouteJsonSchemaHook({method: 'GET', path: '/'}, container);
      onDefineRouteJsonSchemaHook({meta: {}}, container);
      onDefineRouteJsonSchemaHook({meta: {jsonSchema: false}}, container);
      expect(S._parametersValidators.size).to.be.eq(0);
      expect(S._requestBodyValidators.size).to.be.eq(0);
      expect(S._responseBodyValidators.size).to.be.eq(0);
    });

    it('should compile and store parameter validators using the route key', function () {
      const container = new ServiceContainer();
      const S = container.get(TrieRouterJsonSchema);
      const routeDef = {
        method: 'GET',
        path: '/test',
        meta: {
          jsonSchema: {
            params: {type: JsonType.OBJECT},
            query: {type: JsonType.OBJECT},
            headers: {type: JsonType.OBJECT},
            cookies: {type: JsonType.OBJECT},
          },
        },
      };
      onDefineRouteJsonSchemaHook(routeDef, container);
      const routeKey = 'GET//test';
      expect(S._parametersValidators.size).to.be.eq(1);
      expect(S._parametersValidators.get(routeKey)).to.be.a('function');
    });

    it('should compile and store the request body validator using the route key', function () {
      const container = new ServiceContainer();
      const S = container.get(TrieRouterJsonSchema);
      const routeDef = {
        method: 'POST',
        path: '/submit',
        meta: {
          jsonSchema: {
            body: {type: JsonType.OBJECT},
          },
        },
      };
      onDefineRouteJsonSchemaHook(routeDef, container);
      const routeKey = 'POST//submit';
      expect(S._requestBodyValidators.size).to.be.eq(1);
      expect(S._requestBodyValidators.get(routeKey)).to.be.a('function');
    });

    it('should skip compiling request validators if "noRequestValidation" option is true', function () {
      const container = new ServiceContainer();
      const S = new TrieRouterJsonSchema(container, {
        noRequestValidation: true,
      });
      const routeDef = {
        method: 'POST',
        path: '/skip-req',
        meta: {
          jsonSchema: {
            params: {type: JsonType.OBJECT},
            body: {type: JsonType.OBJECT},
          },
        },
      };
      onDefineRouteJsonSchemaHook(routeDef, container);
      expect(S._parametersValidators.size).to.be.eq(0);
      expect(S._requestBodyValidators.size).to.be.eq(0);
    });

    it('should require the "responses" schema to be a plain Object', function () {
      const container = new ServiceContainer();
      new TrieRouterJsonSchema(container);
      const throwable = v => () => {
        const routeDef = {
          method: 'GET',
          path: '/',
          meta: {
            jsonSchema: {
              responses: v,
            },
          },
        };
        onDefineRouteJsonSchemaHook(routeDef, container);
      };
      const error = v =>
        format(
          'The "responses" schema definition must be an Object ' +
            'keyed by status codes, but %s was given.',
          v,
        );
      expect(throwable('str')).to.throw(error('"str"'));
      expect(throwable(10)).to.throw(error('10'));
      expect(throwable(true)).to.throw(error('true'));
      expect(throwable([])).to.throw(error('Array'));
      expect(throwable(null)).to.throw(error('null'));
    });

    it('should compile and store response body validators grouped by status codes', function () {
      const container = new ServiceContainer();
      const S = container.get(TrieRouterJsonSchema);
      const routeDef = {
        method: 'GET',
        path: '/data',
        meta: {
          jsonSchema: {
            responses: {
              200: {type: JsonType.OBJECT},
              404: {type: JsonType.STRING},
              '5xx': {type: JsonType.OBJECT},
            },
          },
        },
      };
      onDefineRouteJsonSchemaHook(routeDef, container);
      const routeKey = 'GET//data';
      expect(S._responseBodyValidators.size).to.be.eq(1);
      const responseValidatorsMap = S._responseBodyValidators.get(routeKey);
      expect(responseValidatorsMap).to.be.an('object');
      expect(responseValidatorsMap['200']).to.be.a('function');
      expect(responseValidatorsMap['404']).to.be.a('function');
      expect(responseValidatorsMap['5xx']).to.be.a('function');
    });

    it('should skip compiling response validators if "noResponseValidation" option is true', function () {
      const container = new ServiceContainer();
      const S = new TrieRouterJsonSchema(container, {
        noResponseValidation: true,
      });
      const routeDef = {
        method: 'GET',
        path: '/skip-res',
        meta: {
          jsonSchema: {
            responses: {
              200: {type: JsonType.OBJECT},
            },
          },
        },
      };
      onDefineRouteJsonSchemaHook(routeDef, container);
      expect(S._responseBodyValidators.size).to.be.eq(0);
    });
  });

  describe('requestValidationJsonSchemaHook', function () {
    it('should do nothing when the option "meta" is missing', function () {
      const container = new ServiceContainer();
      container.use(TrieRouterJsonSchema);
      const ctx = {
        container,
        route: {method: 'GET', path: '/test'},
        meta: undefined,
        params: {id: '123'},
      };
      requestValidationJsonSchemaHook(ctx);
      expect(ctx.params.id).to.be.eq('123');
    });

    it('should do nothing when the keyowrd "jsonSchema" is missing', function () {
      const container = new ServiceContainer();
      container.use(TrieRouterJsonSchema);
      const ctx = {
        container,
        route: {method: 'GET', path: '/test'},
        meta: {},
        params: {id: '123'},
      };
      requestValidationJsonSchemaHook(ctx);
      expect(ctx.params.id).to.be.eq('123');
    });

    it('should do nothing when the keyowrd "jsonSchema" is false', function () {
      const container = new ServiceContainer();
      container.use(TrieRouterJsonSchema);
      const ctx = {
        container,
        route: {method: 'GET', path: '/test'},
        meta: {jsonSchema: false},
        params: {id: '123'},
      };
      requestValidationJsonSchemaHook(ctx);
      expect(ctx.params.id).to.be.eq('123');
    });

    it('should do nothing when the option "noRequestValidation" is true', function () {
      const container = new ServiceContainer();
      const schemaService = new TrieRouterJsonSchema(container, {
        noRequestValidation: true,
      });
      container.set(TrieRouterJsonSchema, schemaService);
      const routeDef = {
        method: 'GET',
        path: '/test',
        meta: {
          jsonSchema: {
            params: {
              type: JsonType.OBJECT,
              properties: {id: {type: JsonType.NUMBER}},
            },
          },
        },
      };
      onDefineRouteJsonSchemaHook(routeDef, container);
      const ctx = {
        container,
        route: {method: 'GET', path: '/test'},
        meta: routeDef.meta,
        params: {id: 'invalid-number'},
        query: {},
        headers: {},
        cookies: {},
      };
      requestValidationJsonSchemaHook(ctx);
      expect(ctx.params.id).to.be.eq('invalid-number');
    });

    describe('params', function () {
      it('should throw BadRequest error when parameters data is invalid', function () {
        const container = new ServiceContainer();
        container.use(TrieRouterJsonSchema);
        const routeDef = {
          method: 'GET',
          path: '/test',
          meta: {
            jsonSchema: {
              params: {
                type: JsonType.OBJECT,
                properties: {
                  id: {type: JsonType.NUMBER},
                },
              },
            },
          },
        };
        onDefineRouteJsonSchemaHook(routeDef, container);
        const ctx = {
          container,
          route: {method: 'GET', path: '/test'},
          meta: routeDef.meta,
          params: {id: 'not-a-number'},
          query: {},
          headers: {},
          cookies: {},
        };
        try {
          requestValidationJsonSchemaHook(ctx);
          throw new Error('Should not be reached');
        } catch (error) {
          expect(error).to.be.instanceOf(HttpErrors.BadRequest);
          expect(error.message).to.be.eq(
            'Request parameters validation failed.',
          );
        }
      });

      it('should overwrite a parameters object when type coercion occurs', function () {
        const container = new ServiceContainer();
        container.use(TrieRouterJsonSchema);
        const routeDef = {
          method: 'GET',
          path: '/test',
          meta: {
            jsonSchema: {
              params: {
                type: JsonType.OBJECT,
                properties: {
                  id: {type: JsonType.NUMBER},
                },
              },
            },
          },
        };
        onDefineRouteJsonSchemaHook(routeDef, container);
        const ctx = {
          container,
          route: {method: 'GET', path: '/test'},
          meta: routeDef.meta,
          params: {id: '42'},
          query: {},
          headers: {},
          cookies: {},
        };
        requestValidationJsonSchemaHook(ctx);
        expect(ctx.params.id).to.be.eq(42);
        expect(typeof ctx.params.id).to.be.eq('number');
      });

      it('should parse a JSON string into an object within params', function () {
        const container = new ServiceContainer();
        container.use(TrieRouterJsonSchema);
        const routeDef = {
          method: 'GET',
          path: '/test',
          meta: {
            jsonSchema: {
              params: {
                type: JsonType.OBJECT,
                properties: {
                  filter: {
                    type: JsonType.OBJECT,
                    properties: {
                      active: {type: JsonType.BOOLEAN},
                    },
                  },
                },
              },
            },
          },
        };
        onDefineRouteJsonSchemaHook(routeDef, container);
        const ctx = {
          container,
          route: {method: 'GET', path: '/test'},
          meta: routeDef.meta,
          params: {filter: '{"active":true}'},
          query: {},
          headers: {},
          cookies: {},
        };
        requestValidationJsonSchemaHook(ctx);
        expect(ctx.params.filter).to.be.an('object');
        expect(ctx.params.filter).to.be.eql({active: true});
      });

      it('should resolve a "$ref" and parse a JSON string into an object within params', function () {
        const container = new ServiceContainer();
        const schemaService = container.get(TrieRouterJsonSchema);
        schemaService.defineSchema({
          $id: 'filterSchema',
          type: JsonType.OBJECT,
          properties: {active: {type: JsonType.BOOLEAN}},
        });
        const routeDef = {
          method: 'GET',
          path: '/test',
          meta: {
            jsonSchema: {
              params: {
                type: JsonType.OBJECT,
                properties: {
                  filter: {$ref: 'filterSchema'},
                },
              },
            },
          },
        };
        onDefineRouteJsonSchemaHook(routeDef, container);
        const ctx = {
          container,
          route: {method: 'GET', path: '/test'},
          meta: routeDef.meta,
          params: {filter: '{"active":true}'},
          query: {},
          headers: {},
          cookies: {},
        };
        requestValidationJsonSchemaHook(ctx);
        expect(ctx.params.filter).to.be.an('object');
        expect(ctx.params.filter).to.be.eql({active: true});
      });
    });

    describe('query', function () {
      it('should throw BadRequest error when query data is invalid', function () {
        const container = new ServiceContainer();
        container.use(TrieRouterJsonSchema);
        const routeDef = {
          method: 'GET',
          path: '/test',
          meta: {
            jsonSchema: {
              query: {
                type: JsonType.OBJECT,
                properties: {
                  limit: {type: JsonType.NUMBER},
                },
              },
            },
          },
        };
        onDefineRouteJsonSchemaHook(routeDef, container);
        const ctx = {
          container,
          route: {method: 'GET', path: '/test'},
          meta: routeDef.meta,
          params: {},
          query: {limit: 'not-a-number'},
          headers: {},
          cookies: {},
        };
        try {
          requestValidationJsonSchemaHook(ctx);
          throw new Error('Should not be reached');
        } catch (error) {
          expect(error).to.be.instanceOf(HttpErrors.BadRequest);
          expect(error.message).to.be.eq(
            'Request parameters validation failed.',
          );
        }
      });

      it('should overwrite a query object when type coercion occurs', function () {
        const container = new ServiceContainer();
        container.use(TrieRouterJsonSchema);
        const routeDef = {
          method: 'GET',
          path: '/test',
          meta: {
            jsonSchema: {
              query: {
                type: JsonType.OBJECT,
                properties: {
                  limit: {type: JsonType.NUMBER},
                },
              },
            },
          },
        };
        onDefineRouteJsonSchemaHook(routeDef, container);
        const ctx = {
          container,
          route: {method: 'GET', path: '/test'},
          meta: routeDef.meta,
          params: {},
          query: {limit: '100'},
          headers: {},
          cookies: {},
        };
        requestValidationJsonSchemaHook(ctx);
        expect(ctx.query.limit).to.be.eq(100);
        expect(typeof ctx.query.limit).to.be.eq('number');
      });

      it('should parse a JSON string into an array within query', function () {
        const container = new ServiceContainer();
        container.use(TrieRouterJsonSchema);
        const routeDef = {
          method: 'GET',
          path: '/test',
          meta: {
            jsonSchema: {
              query: {
                type: JsonType.OBJECT,
                properties: {
                  tags: {
                    type: JsonType.ARRAY,
                    items: {type: JsonType.STRING},
                  },
                },
              },
            },
          },
        };
        onDefineRouteJsonSchemaHook(routeDef, container);
        const ctx = {
          container,
          route: {method: 'GET', path: '/test'},
          meta: routeDef.meta,
          params: {},
          query: {tags: '["news", "updates"]'},
          headers: {},
          cookies: {},
        };
        requestValidationJsonSchemaHook(ctx);
        expect(ctx.query.tags).to.be.an('array');
        expect(ctx.query.tags).to.be.eql(['news', 'updates']);
      });
    });

    describe('headers', function () {
      it('should throw BadRequest error when headers data is invalid', function () {
        const container = new ServiceContainer();
        container.use(TrieRouterJsonSchema);
        const routeDef = {
          method: 'GET',
          path: '/test',
          meta: {
            jsonSchema: {
              headers: {
                type: JsonType.OBJECT,
                properties: {
                  'x-custom-id': {type: JsonType.NUMBER},
                },
              },
            },
          },
        };
        onDefineRouteJsonSchemaHook(routeDef, container);
        const ctx = {
          container,
          route: {method: 'GET', path: '/test'},
          meta: routeDef.meta,
          params: {},
          query: {},
          headers: {'x-custom-id': 'invalid'},
          cookies: {},
        };
        try {
          requestValidationJsonSchemaHook(ctx);
          throw new Error('Should not be reached');
        } catch (error) {
          expect(error).to.be.instanceOf(HttpErrors.BadRequest);
          expect(error.message).to.be.eq(
            'Request parameters validation failed.',
          );
        }
      });

      it('should overwrite a headers object when type coercion occurs', function () {
        const container = new ServiceContainer();
        container.use(TrieRouterJsonSchema);
        const routeDef = {
          method: 'GET',
          path: '/test',
          meta: {
            jsonSchema: {
              headers: {
                type: JsonType.OBJECT,
                properties: {
                  'x-custom-id': {type: JsonType.NUMBER},
                },
              },
            },
          },
        };
        onDefineRouteJsonSchemaHook(routeDef, container);
        const ctx = {
          container,
          route: {method: 'GET', path: '/test'},
          meta: routeDef.meta,
          params: {},
          query: {},
          headers: {'x-custom-id': '99'},
          cookies: {},
        };
        requestValidationJsonSchemaHook(ctx);
        expect(ctx.headers['x-custom-id']).to.be.eq(99);
        expect(typeof ctx.headers['x-custom-id']).to.be.eq('number');
      });

      it('should parse a JSON string into an object within headers', function () {
        const container = new ServiceContainer();
        container.use(TrieRouterJsonSchema);
        const routeDef = {
          method: 'GET',
          path: '/test',
          meta: {
            jsonSchema: {
              headers: {
                type: JsonType.OBJECT,
                properties: {
                  'x-metadata': {
                    type: JsonType.OBJECT,
                    properties: {
                      role: {type: JsonType.STRING},
                      level: {type: JsonType.NUMBER},
                    },
                  },
                },
              },
            },
          },
        };
        onDefineRouteJsonSchemaHook(routeDef, container);
        const ctx = {
          container,
          route: {method: 'GET', path: '/test'},
          meta: routeDef.meta,
          params: {},
          query: {},
          headers: {'x-metadata': '{"role":"admin","level":5}'},
          cookies: {},
        };
        requestValidationJsonSchemaHook(ctx);
        expect(ctx.headers['x-metadata']).to.be.an('object');
        expect(ctx.headers['x-metadata']).to.be.eql({role: 'admin', level: 5});
      });
    });

    describe('cookies', function () {
      it('should throw BadRequest error when cookies data is invalid', function () {
        const container = new ServiceContainer();
        container.use(TrieRouterJsonSchema);
        const routeDef = {
          method: 'GET',
          path: '/test',
          meta: {
            jsonSchema: {
              cookies: {
                type: JsonType.OBJECT,
                properties: {
                  sessionVersion: {type: JsonType.NUMBER},
                },
              },
            },
          },
        };
        onDefineRouteJsonSchemaHook(routeDef, container);
        const ctx = {
          container,
          route: {method: 'GET', path: '/test'},
          meta: routeDef.meta,
          params: {},
          query: {},
          headers: {},
          cookies: {sessionVersion: 'abc'},
        };
        try {
          requestValidationJsonSchemaHook(ctx);
          throw new Error('Should not be reached');
        } catch (error) {
          expect(error).to.be.instanceOf(HttpErrors.BadRequest);
          expect(error.message).to.be.eq(
            'Request parameters validation failed.',
          );
        }
      });

      it('should overwrite a cookies object when type coercion occurs', function () {
        const container = new ServiceContainer();
        container.use(TrieRouterJsonSchema);
        const routeDef = {
          method: 'GET',
          path: '/test',
          meta: {
            jsonSchema: {
              cookies: {
                type: JsonType.OBJECT,
                properties: {
                  sessionVersion: {type: JsonType.NUMBER},
                },
              },
            },
          },
        };
        onDefineRouteJsonSchemaHook(routeDef, container);
        const ctx = {
          container,
          route: {method: 'GET', path: '/test'},
          meta: routeDef.meta,
          params: {},
          query: {},
          headers: {},
          cookies: {sessionVersion: '2'},
        };
        requestValidationJsonSchemaHook(ctx);
        expect(ctx.cookies.sessionVersion).to.be.eq(2);
        expect(typeof ctx.cookies.sessionVersion).to.be.eq('number');
      });

      it('should parse a JSON string into an object within cookies', function () {
        const container = new ServiceContainer();
        container.use(TrieRouterJsonSchema);
        const routeDef = {
          method: 'GET',
          path: '/test',
          meta: {
            jsonSchema: {
              cookies: {
                type: JsonType.OBJECT,
                properties: {
                  sessionData: {
                    type: JsonType.OBJECT,
                    properties: {
                      userId: {type: JsonType.NUMBER},
                    },
                  },
                },
              },
            },
          },
        };
        onDefineRouteJsonSchemaHook(routeDef, container);
        const ctx = {
          container,
          route: {method: 'GET', path: '/test'},
          meta: routeDef.meta,
          params: {},
          query: {},
          headers: {},
          cookies: {sessionData: '{"userId":42}'},
        };
        requestValidationJsonSchemaHook(ctx);
        expect(ctx.cookies.sessionData).to.be.an('object');
        expect(ctx.cookies.sessionData).to.be.eql({userId: 42});
      });
    });

    describe('body', function () {
      it('should throw BadRequest error when a request body is invalid', function () {
        const container = new ServiceContainer();
        container.use(TrieRouterJsonSchema);
        const routeDef = {
          method: 'POST',
          path: '/test',
          meta: {
            jsonSchema: {
              body: {
                type: JsonType.OBJECT,
                properties: {
                  title: {type: JsonType.STRING},
                  count: {type: JsonType.NUMBER},
                },
                required: ['title', 'count'],
              },
            },
          },
        };
        onDefineRouteJsonSchemaHook(routeDef, container);
        const ctx = {
          container,
          route: {method: 'POST', path: '/test'},
          meta: routeDef.meta,
          params: {},
          query: {},
          headers: {},
          cookies: {},
          body: {title: 'Hello', count: 'not-a-number'},
        };
        try {
          requestValidationJsonSchemaHook(ctx);
          throw new Error('Should not be reached');
        } catch (error) {
          expect(error).to.be.instanceOf(HttpErrors.BadRequest);
          expect(error.message).to.be.eq('Request body validation failed.');
        }
      });

      it('should overwrite a request body when type coercion occurs', function () {
        const container = new ServiceContainer();
        container.use(TrieRouterJsonSchema);
        const routeDef = {
          method: 'POST',
          path: '/test',
          meta: {
            jsonSchema: {
              body: {
                type: JsonType.OBJECT,
                properties: {
                  title: {type: JsonType.STRING},
                  count: {type: JsonType.NUMBER},
                },
              },
            },
          },
        };
        onDefineRouteJsonSchemaHook(routeDef, container);
        const ctx = {
          container,
          route: {method: 'POST', path: '/test'},
          meta: routeDef.meta,
          params: {},
          query: {},
          headers: {},
          cookies: {},
          body: {title: 'Hello', count: '10'},
        };
        requestValidationJsonSchemaHook(ctx);
        expect(ctx.body.count).to.be.eq(10);
        expect(typeof ctx.body.count).to.be.eq('number');
      });
    });
  });

  describe('responseValidationJsonSchemaHook', function () {
    it('should do nothing when the keyword "jsonSchema" is missing', function () {
      const container = new ServiceContainer();
      container.use(TrieRouterJsonSchema);
      const ctx = {
        container,
        route: {method: 'GET', path: '/test'},
        meta: {},
        response: {statusCode: 200},
      };
      const data = {foo: 'bar'};
      const result = responseValidationJsonSchemaHook(ctx, data);
      expect(result).to.be.undefined;
    });

    it('should do nothing when the keyword "jsonSchema" is false', function () {
      const container = new ServiceContainer();
      container.use(TrieRouterJsonSchema);
      const ctx = {
        container,
        route: {method: 'GET', path: '/test'},
        meta: {jsonSchema: false},
        response: {statusCode: 200},
      };
      const data = {foo: 'bar'};
      const result = responseValidationJsonSchemaHook(ctx, data);
      expect(result).to.be.undefined;
    });

    it('should do nothing when the option "noResponseValidation" is true', function () {
      const container = new ServiceContainer();
      const schemaService = new TrieRouterJsonSchema(container, {
        noResponseValidation: true,
      });
      container.set(TrieRouterJsonSchema, schemaService);
      const routeDef = {
        method: 'GET',
        path: '/test',
        meta: {
          jsonSchema: {
            responses: {
              200: {type: JsonType.NUMBER},
            },
          },
        },
      };
      onDefineRouteJsonSchemaHook(routeDef, container);
      const ctx = {
        container,
        route: {method: 'GET', path: '/test'},
        meta: routeDef.meta,
        response: {statusCode: 200},
      };
      const data = 'invalid-number';
      const result = responseValidationJsonSchemaHook(ctx, data);
      expect(result).to.be.undefined;
    });

    it('should not validate Buffer objects', function () {
      const container = new ServiceContainer();
      container.use(TrieRouterJsonSchema);
      const routeDef = {
        method: 'GET',
        path: '/test',
        meta: {
          jsonSchema: {
            responses: {
              200: {type: JsonType.NUMBER},
            },
          },
        },
      };
      onDefineRouteJsonSchemaHook(routeDef, container);
      const ctx = {
        container,
        route: {method: 'GET', path: '/test'},
        meta: routeDef.meta,
        response: {statusCode: 200},
      };
      const data = Buffer.from('some binary data');
      const result = responseValidationJsonSchemaHook(ctx, data);
      expect(result).to.be.undefined;
    });

    it('should not validate Stream objects', function () {
      const container = new ServiceContainer();
      container.use(TrieRouterJsonSchema);
      const routeDef = {
        method: 'GET',
        path: '/test',
        meta: {
          jsonSchema: {
            responses: {
              200: {type: JsonType.NUMBER},
            },
          },
        },
      };
      onDefineRouteJsonSchemaHook(routeDef, container);
      const ctx = {
        container,
        route: {method: 'GET', path: '/test'},
        meta: routeDef.meta,
        response: {statusCode: 200},
      };
      const data = new Readable();
      data.push('stream data');
      data.push(null);
      const result = responseValidationJsonSchemaHook(ctx, data);
      expect(result).to.be.undefined;
    });

    describe('specific status code (e.g. 200)', function () {
      it('should do nothing when the response status code does not match', function () {
        const container = new ServiceContainer();
        container.use(TrieRouterJsonSchema);
        const routeDef = {
          method: 'GET',
          path: '/test',
          meta: {
            jsonSchema: {
              responses: {
                200: {type: JsonType.NUMBER},
              },
            },
          },
        };
        onDefineRouteJsonSchemaHook(routeDef, container);
        const ctx = {
          container,
          route: {method: 'GET', path: '/test'},
          meta: routeDef.meta,
          response: {statusCode: 201},
        };
        const result = responseValidationJsonSchemaHook(ctx, 'not-a-number');
        expect(result).to.be.undefined;
      });

      it('should throw InternalServerError when response data is invalid', function () {
        const container = new ServiceContainer();
        container.use(TrieRouterJsonSchema);
        const routeDef = {
          method: 'GET',
          path: '/test',
          meta: {
            jsonSchema: {
              responses: {
                200: {
                  type: JsonType.OBJECT,
                  properties: {
                    id: {type: JsonType.NUMBER},
                  },
                  required: ['id'],
                },
              },
            },
          },
        };
        onDefineRouteJsonSchemaHook(routeDef, container);
        const ctx = {
          container,
          route: {method: 'GET', path: '/test'},
          meta: routeDef.meta,
          response: {statusCode: 200},
        };
        const invalidData = {id: 'not-a-number'};
        try {
          responseValidationJsonSchemaHook(ctx, invalidData);
          throw new Error('Should not be reached');
        } catch (error) {
          expect(error).to.be.instanceOf(HttpErrors.InternalServerError);
          expect(error.message).to.be.eq('Response body validation failed.');
        }
      });

      it('should return modified data when type coercion occurs', function () {
        const container = new ServiceContainer();
        container.use(TrieRouterJsonSchema);
        const routeDef = {
          method: 'GET',
          path: '/test',
          meta: {
            jsonSchema: {
              responses: {
                200: {
                  type: JsonType.OBJECT,
                  properties: {
                    id: {type: JsonType.NUMBER},
                  },
                },
              },
            },
          },
        };
        onDefineRouteJsonSchemaHook(routeDef, container);
        const ctx = {
          container,
          route: {method: 'GET', path: '/test'},
          meta: routeDef.meta,
          response: {statusCode: 200},
        };
        const data = {id: '42'};
        const result = responseValidationJsonSchemaHook(ctx, data);
        expect(result).to.be.eql({id: 42});
        expect(typeof result.id).to.be.eq('number');
      });
    });

    describe('status pattern (e.g. 2xx / 2XX)', function () {
      it('should do nothing when the response status code does not match the pattern', function () {
        const container = new ServiceContainer();
        container.use(TrieRouterJsonSchema);
        const routeDef = {
          method: 'GET',
          path: '/test',
          meta: {
            jsonSchema: {
              responses: {
                '2xx': {type: JsonType.NUMBER},
              },
            },
          },
        };
        onDefineRouteJsonSchemaHook(routeDef, container);
        const ctx = {
          container,
          route: {method: 'GET', path: '/test'},
          meta: routeDef.meta,
          response: {statusCode: 400},
        };
        const result = responseValidationJsonSchemaHook(ctx, 'not-a-number');
        expect(result).to.be.undefined;
      });

      it('should throw InternalServerError when response data is invalid', function () {
        const container = new ServiceContainer();
        container.use(TrieRouterJsonSchema);
        const routeDef = {
          method: 'GET',
          path: '/test',
          meta: {
            jsonSchema: {
              responses: {
                '2xx': {
                  type: JsonType.OBJECT,
                  properties: {
                    active: {type: JsonType.BOOLEAN},
                  },
                },
              },
            },
          },
        };
        onDefineRouteJsonSchemaHook(routeDef, container);
        const ctx = {
          container,
          route: {method: 'GET', path: '/test'},
          meta: routeDef.meta,
          response: {statusCode: 201},
        };
        const invalidData = {active: 'not-a-boolean'};
        try {
          responseValidationJsonSchemaHook(ctx, invalidData);
          throw new Error('Should not be reached');
        } catch (error) {
          expect(error).to.be.instanceOf(HttpErrors.InternalServerError);
          expect(error.message).to.be.eq('Response body validation failed.');
        }
      });

      it('should match the status code pattern in upper case', function () {
        const container = new ServiceContainer();
        container.use(TrieRouterJsonSchema);
        const routeDef = {
          method: 'GET',
          path: '/test',
          meta: {
            jsonSchema: {
              responses: {
                '2XX': {
                  type: JsonType.OBJECT,
                  properties: {
                    active: {type: JsonType.BOOLEAN},
                  },
                },
              },
            },
          },
        };
        onDefineRouteJsonSchemaHook(routeDef, container);
        const ctx = {
          container,
          route: {method: 'GET', path: '/test'},
          meta: routeDef.meta,
          response: {statusCode: 201},
        };
        const invalidData = {active: 'not-a-boolean'};
        try {
          responseValidationJsonSchemaHook(ctx, invalidData);
          throw new Error('Should not be reached');
        } catch (error) {
          expect(error).to.be.instanceOf(HttpErrors.InternalServerError);
          expect(error.message).to.be.eq('Response body validation failed.');
        }
      });

      it('should return modified data when type coercion occurs', function () {
        const container = new ServiceContainer();
        container.use(TrieRouterJsonSchema);
        const routeDef = {
          method: 'GET',
          path: '/test',
          meta: {
            jsonSchema: {
              responses: {
                '2xx': {
                  type: JsonType.OBJECT,
                  properties: {
                    active: {type: JsonType.BOOLEAN},
                  },
                },
              },
            },
          },
        };
        onDefineRouteJsonSchemaHook(routeDef, container);
        const ctx = {
          container,
          route: {method: 'GET', path: '/test'},
          meta: routeDef.meta,
          response: {statusCode: 204},
        };
        const data = {active: 'true'};
        const result = responseValidationJsonSchemaHook(ctx, data);
        expect(result).to.be.eql({active: true});
        expect(typeof result.active).to.be.eq('boolean');
      });
    });

    describe('default / DEFAULT status', function () {
      it('should throw InternalServerError when response data is invalid', function () {
        const container = new ServiceContainer();
        container.use(TrieRouterJsonSchema);
        const routeDef = {
          method: 'GET',
          path: '/test',
          meta: {
            jsonSchema: {
              responses: {
                default: {
                  type: JsonType.OBJECT,
                  properties: {
                    message: {type: JsonType.STRING},
                  },
                  required: ['message'],
                },
              },
            },
          },
        };
        onDefineRouteJsonSchemaHook(routeDef, container);
        const ctx = {
          container,
          route: {method: 'GET', path: '/test'},
          meta: routeDef.meta,
          response: {statusCode: 502},
        };
        const invalidData = {foo: 'bar'};
        try {
          responseValidationJsonSchemaHook(ctx, invalidData);
          throw new Error('Should not be reached');
        } catch (error) {
          expect(error).to.be.instanceOf(HttpErrors.InternalServerError);
          expect(error.message).to.be.eq('Response body validation failed.');
        }
      });

      it('should return modified data when type coercion occurs', function () {
        const container = new ServiceContainer();
        container.use(TrieRouterJsonSchema);
        const routeDef = {
          method: 'GET',
          path: '/test',
          meta: {
            jsonSchema: {
              responses: {
                DEFAULT: {
                  type: JsonType.OBJECT,
                  properties: {
                    code: {type: JsonType.NUMBER},
                  },
                },
              },
            },
          },
        };
        onDefineRouteJsonSchemaHook(routeDef, container);
        const ctx = {
          container,
          route: {method: 'GET', path: '/test'},
          meta: routeDef.meta,
          response: {statusCode: 418},
        };
        const data = {code: '418'};
        const result = responseValidationJsonSchemaHook(ctx, data);
        expect(result).to.be.eql({code: 418});
        expect(typeof result.code).to.be.eq('number');
      });
    });
  });

  describe('parseJsonParameters', function () {
    it('should return the original value when "params" is a string', function () {
      const result = parseJsonParameters('string', {});
      expect(result).to.be.eq('string');
    });

    it('should return the original value when "params" is a number', function () {
      const result = parseJsonParameters(123, {});
      expect(result).to.be.eq(123);
    });

    it('should return the original value when "params" is an array', function () {
      const params = [1, 2, 3];
      const result = parseJsonParameters(params, {});
      expect(result).to.be.eq(params);
    });

    it('should return the original value when "params" is undefined', function () {
      const result = parseJsonParameters(undefined, {});
      expect(result).to.be.undefined;
    });

    it('should return the original value when "params" is null', function () {
      const result = parseJsonParameters(null, {});
      expect(result).to.be.null;
    });

    it('should return a new object with original values when "schema" is undefined', function () {
      const params = {foo: '{"bar": 1}'};
      const result = parseJsonParameters(params, undefined);
      expect(result).to.be.eql(params);
      expect(result).to.be.not.eq(params);
    });

    it('should return original values when "schema" lacks the "properties" object', function () {
      const params = {foo: '{"bar": 1}'};
      const schema = {type: JsonType.OBJECT};
      const result = parseJsonParameters(params, schema);
      expect(result).to.be.eql(params);
    });

    describe('parsing objects', function () {
      it('should parse a valid JSON string into an object when schema expects an object', function () {
        const params = {filter: '{"active": true}'};
        const schema = {properties: {filter: {type: JsonType.OBJECT}}};
        const result = parseJsonParameters(params, schema);
        expect(result.filter).to.be.an('object');
        expect(result.filter).to.be.eql({active: true});
      });

      it('should fallback to the original string when JSON string is invalid', function () {
        const params = {filter: '{active: true}'}; // нет кавычек у ключа
        const schema = {properties: {filter: {type: JsonType.OBJECT}}};
        const result = parseJsonParameters(params, schema);
        expect(result.filter).to.be.eq('{active: true}');
      });

      it('should not parse when a string looks like an array but the schema expects an object', function () {
        const params = {filter: '[1, 2, 3]'};
        const schema = {properties: {filter: {type: JsonType.OBJECT}}};
        const result = parseJsonParameters(params, schema);
        expect(result.filter).to.be.eq('[1, 2, 3]');
      });
    });

    describe('parsing arrays', function () {
      it('should parse a valid JSON string into an array when the schema expects an array', function () {
        const params = {tags: '["news", "updates"]'};
        const schema = {properties: {tags: {type: JsonType.ARRAY}}};
        const result = parseJsonParameters(params, schema);
        expect(result.tags).to.be.an('array');
        expect(result.tags).to.be.eql(['news', 'updates']);
      });

      it('should fallback to the original string when JSON array is invalid', function () {
        const params = {tags: '["news", "updates"'}; // нет закрывающей скобки
        const schema = {properties: {tags: {type: JsonType.ARRAY}}};
        const result = parseJsonParameters(params, schema);
        expect(result.tags).to.be.eq('["news", "updates"');
      });

      it('should not parse when a string looks like an object but the schema expects an array', function () {
        const params = {tags: '{"news": true}'};
        const schema = {properties: {tags: {type: JsonType.ARRAY}}};
        const result = parseJsonParameters(params, schema);
        expect(result.tags).to.be.eq('{"news": true}');
      });
    });

    describe('edge cases and specific behaviors', function () {
      it('should correctly parse strings that have trailing or leading whitespaces', function () {
        const params = {data: '  {"key": "value"}  '};
        const schema = {properties: {data: {type: JsonType.OBJECT}}};
        const result = parseJsonParameters(params, schema);
        expect(result.data).to.be.eql({key: 'value'});
      });

      it('should support schema types defined as an array of strings', function () {
        const params = {data: '{"key": "value"}'};
        const schema = {
          properties: {
            data: {
              type: [JsonType.STRING, JsonType.OBJECT],
            },
          },
        };
        const result = parseJsonParameters(params, schema);
        expect(result.data).to.be.eql({key: 'value'});
      });

      it('should pass non-string values through without modifying them', function () {
        const params = {
          num: 42,
          bool: true,
          alreadyObj: {foo: 'bar'},
        };
        const schema = {
          properties: {
            num: {type: JsonType.NUMBER},
            bool: {type: JsonType.BOOLEAN},
            alreadyObj: {type: JsonType.OBJECT},
          },
        };
        const result = parseJsonParameters(params, schema);
        expect(result.num).to.be.eq(42);
        expect(result.bool).to.be.true;
        expect(result.alreadyObj).to.be.eql({foo: 'bar'});
      });

      it('should only parse fields defined in the schema and leave others intact', function () {
        const params = {
          parsedField: '{"a": 1}',
          unparsedField: '{"b": 2}',
        };
        const schema = {
          properties: {
            parsedField: {type: JsonType.OBJECT},
            // unparsedField отсутствует в схеме
          },
        };
        const result = parseJsonParameters(params, schema);
        expect(result.parsedField).to.be.eql({a: 1});
        expect(result.unparsedField).to.be.eq('{"b": 2}');
      });
    });

    describe('parsing via "$ref"', function () {
      it('should parse a JSON string into an object when the referenced schema expects an object', function () {
        const ajv = createAjv();
        ajv.addSchema({$id: 'filterSchema', type: JsonType.OBJECT});
        const params = {filter: '{"active": true}'};
        const schema = {properties: {filter: {$ref: 'filterSchema'}}};
        const result = parseJsonParameters(params, schema, ajv);
        expect(result.filter).to.be.eql({active: true});
      });

      it('should parse a JSON string into an array when the referenced schema expects an array', function () {
        const ajv = createAjv();
        ajv.addSchema({$id: 'tagsSchema', type: JsonType.ARRAY});
        const params = {tags: '["news", "updates"]'};
        const schema = {properties: {tags: {$ref: 'tagsSchema'}}};
        const result = parseJsonParameters(params, schema, ajv);
        expect(result.tags).to.be.eql(['news', 'updates']);
      });

      it('should not parse a value when the referenced schema is not registered in Ajv', function () {
        const ajv = createAjv();
        const params = {filter: '{"active": true}'};
        const schema = {properties: {filter: {$ref: 'unknownSchema'}}};
        const result = parseJsonParameters(params, schema, ajv);
        expect(result.filter).to.be.eq('{"active": true}');
      });

      it('should not parse a value when no Ajv instance is provided and the property uses "$ref"', function () {
        const params = {filter: '{"active": true}'};
        const schema = {properties: {filter: {$ref: 'filterSchema'}}};
        const result = parseJsonParameters(params, schema, undefined);
        expect(result.filter).to.be.eq('{"active": true}');
      });

      it('should prioritize the "type" keyword defined directly on the property over "$ref"', function () {
        const ajv = createAjv();
        ajv.addSchema({$id: 'tagsSchema', type: JsonType.ARRAY});
        const params = {filter: '{"active": true}'};
        const schema = {
          properties: {filter: {type: JsonType.OBJECT, $ref: 'tagsSchema'}},
        };
        const result = parseJsonParameters(params, schema, ajv);
        expect(result.filter).to.be.eql({active: true});
      });
    });
  });

  describe('resolveSchemaType', function () {
    it('should return undefined when the schema is undefined', function () {
      const result = resolveSchemaType(undefined, undefined);
      expect(result).to.be.undefined;
    });

    it('should return undefined when the schema is null', function () {
      const result = resolveSchemaType(null, undefined);
      expect(result).to.be.undefined;
    });

    it('should return undefined when the schema is not an Object', function () {
      const result = resolveSchemaType('not-a-schema', undefined);
      expect(result).to.be.undefined;
    });

    it('should return undefined when the schema is an Array', function () {
      const result = resolveSchemaType([], undefined);
      expect(result).to.be.undefined;
    });

    it('should return the "type" keyword when it is defined directly on the schema', function () {
      const result = resolveSchemaType({type: JsonType.OBJECT}, undefined);
      expect(result).to.be.eq(JsonType.OBJECT);
    });

    it('should return an array of types when the "type" keyword is an array', function () {
      const schema = {type: [JsonType.STRING, JsonType.OBJECT]};
      const result = resolveSchemaType(schema, undefined);
      expect(result).to.be.eql([JsonType.STRING, JsonType.OBJECT]);
    });

    it('should return undefined when the schema has a "$ref" but no Ajv instance is given', function () {
      const result = resolveSchemaType({$ref: 'user'}, undefined);
      expect(result).to.be.undefined;
    });

    it('should return undefined when the referenced schema is not registered in Ajv', function () {
      const ajv = createAjv();
      const result = resolveSchemaType({$ref: 'user'}, ajv);
      expect(result).to.be.undefined;
    });

    it('should resolve the "type" keyword from a schema registered by "$id"', function () {
      const ajv = createAjv();
      ajv.addSchema({$id: 'user', type: JsonType.OBJECT});
      const result = resolveSchemaType({$ref: 'user'}, ajv);
      expect(result).to.be.eq(JsonType.OBJECT);
    });

    it('should follow a chain of "$ref" references until a "type" is found', function () {
      const ajv = createAjv();
      ajv.addSchema({$id: 'userRef', $ref: 'user'});
      ajv.addSchema({$id: 'user', type: JsonType.OBJECT});
      const result = resolveSchemaType({$ref: 'userRef'}, ajv);
      expect(result).to.be.eq(JsonType.OBJECT);
    });

    it('should stop following a circular "$ref" chain and return undefined', function () {
      // schemaA -> schemaB -> schemaA -> ... без ключа "type"
      const ajv = createAjv();
      ajv.addSchema({$id: 'schemaA', $ref: 'schemaB'});
      ajv.addSchema({$id: 'schemaB', $ref: 'schemaA'});
      const result = resolveSchemaType({$ref: 'schemaA'}, ajv);
      expect(result).to.be.undefined;
    });

    it('should not exceed the maximum resolution depth', function () {
      // цепочка из 16 ссылок превышает лимит глубины (10),
      // поэтому итоговый "type" не должен быть найден
      const ajv = createAjv();
      for (let i = 0; i < 15; i++) {
        ajv.addSchema({$id: `link${i}`, $ref: `link${i + 1}`});
      }
      ajv.addSchema({$id: 'link15', type: JsonType.OBJECT});
      const result = resolveSchemaType({$ref: 'link0'}, ajv);
      expect(result).to.be.undefined;
    });
  });
});
