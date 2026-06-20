import {expect} from 'chai';
import HttpErrors from 'http-errors';
import {format} from '@e22m4u/js-format';
import {JsonType} from './json-schema.js';
import {ServiceContainer} from '@e22m4u/js-service';
import {RouterHookRegistry, RouterHookType} from '@e22m4u/js-trie-router';

import {
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
      expect(S._parametersValidatiors.size).to.be.eq(0);
      expect(S._requestBodyValidatiors.size).to.be.eq(0);
      expect(S._responseBodyValidatiors.size).to.be.eq(0);
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
      expect(S._parametersValidatiors.size).to.be.eq(1);
      expect(S._parametersValidatiors.get(routeKey)).to.be.a('function');
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
      expect(S._requestBodyValidatiors.size).to.be.eq(1);
      expect(S._requestBodyValidatiors.get(routeKey)).to.be.a('function');
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
      expect(S._parametersValidatiors.size).to.be.eq(0);
      expect(S._requestBodyValidatiors.size).to.be.eq(0);
    });

    it('should require the "response" schema to be a plain Object', function () {
      const container = new ServiceContainer();
      new TrieRouterJsonSchema(container);
      const throwable = v => () => {
        const routeDef = {
          method: 'GET',
          path: '/',
          meta: {
            jsonSchema: {
              response: v,
            },
          },
        };
        onDefineRouteJsonSchemaHook(routeDef, container);
      };
      const error = v =>
        format(
          'The "response" schema definition must be an Object ' +
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
            response: {
              200: {type: JsonType.OBJECT},
              404: {type: JsonType.STRING},
              '5xx': {type: JsonType.OBJECT},
            },
          },
        },
      };
      onDefineRouteJsonSchemaHook(routeDef, container);
      const routeKey = 'GET//data';
      expect(S._responseBodyValidatiors.size).to.be.eq(1);
      const responseValidatorsMap = S._responseBodyValidatiors.get(routeKey);
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
            response: {
              200: {type: JsonType.OBJECT},
            },
          },
        },
      };
      onDefineRouteJsonSchemaHook(routeDef, container);
      expect(S._responseBodyValidatiors.size).to.be.eq(0);
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
});
