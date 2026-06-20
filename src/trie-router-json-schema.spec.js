import {expect} from 'chai';
import {format} from '@e22m4u/js-format';
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
      const service = new TrieRouterJsonSchema(container);
      expect(service.container).to.be.eq(container);
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
      const service = new TrieRouterJsonSchema(container, options);
      expect(service._options).to.be.eql(options);
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
      const service = new TrieRouterJsonSchema();
      const res1 = service._getParametersAjvInstance();
      const res2 = service._getParametersAjvInstance();
      expect(res1).to.be.an('object');
      expect(res1).to.be.eq(res2);
    });

    it('should create an Ajv instance with correct default options', function () {
      const container = new ServiceContainer();
      const service = new TrieRouterJsonSchema(container);
      const ajv = service._getParametersAjvInstance();
      expect(ajv.opts.coerceTypes).to.be.true;
      expect(ajv.opts.useDefaults).to.be.true;
      expect(ajv.opts.removeAdditional).to.be.true;
    });

    it('should create an Ajv instance respecting custom options', function () {
      const container = new ServiceContainer();
      const service = new TrieRouterJsonSchema(container, {
        noCoerceTypesInParameters: true,
        noDefaultValuesInParameters: true,
      });
      const ajv = service._getParametersAjvInstance();
      expect(ajv.opts.coerceTypes).to.be.false;
      expect(ajv.opts.useDefaults).to.be.false;
      expect(ajv.opts.removeAdditional).to.be.true;
    });
  });

  describe('_getRequestBodyAjvInstance', function () {
    it('should return the same Ajv instance on subsequent calls', function () {
      const service = new TrieRouterJsonSchema();
      const res1 = service._getRequestBodyAjvInstance();
      const res2 = service._getRequestBodyAjvInstance();
      expect(res1).to.be.an('object');
      expect(res1).to.be.eq(res2);
    });

    it('should create an Ajv instance with correct default options', function () {
      const container = new ServiceContainer();
      const service = new TrieRouterJsonSchema(container);
      const ajv = service._getRequestBodyAjvInstance();
      expect(ajv.opts.coerceTypes).to.be.true;
      expect(ajv.opts.useDefaults).to.be.true;
      expect(ajv.opts.removeAdditional).to.be.true;
    });

    it('should create an Ajv instance respecting custom options', function () {
      const container = new ServiceContainer();
      const service = new TrieRouterJsonSchema(container, {
        noCoerceTypesInRequestBody: true,
        noDefaultValuesInRequestBody: true,
      });
      const ajv = service._getRequestBodyAjvInstance();
      expect(ajv.opts.coerceTypes).to.be.false;
      expect(ajv.opts.useDefaults).to.be.false;
      expect(ajv.opts.removeAdditional).to.be.true;
    });
  });

  describe('_getResponseBodyAjvInstance', function () {
    it('should return the same Ajv instance on subsequent calls', function () {
      const service = new TrieRouterJsonSchema();
      const res1 = service._getResponseBodyAjvInstance();
      const res2 = service._getResponseBodyAjvInstance();
      expect(res1).to.be.an('object');
      expect(res1).to.be.eq(res2);
    });

    it('should create an Ajv instance with correct default options', function () {
      const container = new ServiceContainer();
      const service = new TrieRouterJsonSchema(container);
      const ajv = service._getResponseBodyAjvInstance();
      expect(ajv.opts.coerceTypes).to.be.true;
      expect(ajv.opts.useDefaults).to.be.true;
      expect(ajv.opts.removeAdditional).to.be.true;
    });

    it('should create an Ajv instance respecting custom options', function () {
      const container = new ServiceContainer();
      const service = new TrieRouterJsonSchema(container, {
        noCoerceTypesInResponseBody: true,
        noDefaultValuesInResponseBody: true,
      });
      const ajv = service._getResponseBodyAjvInstance();
      expect(ajv.opts.coerceTypes).to.be.false;
      expect(ajv.opts.useDefaults).to.be.false;
      expect(ajv.opts.removeAdditional).to.be.true;
    });
  });

  describe('defineSchema', function () {
    it('should require the parameter "schema" to be an Object', function () {
      const service = new TrieRouterJsonSchema();
      const throwable = v => () => service.defineSchema(v);
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
      const service = new TrieRouterJsonSchema();
      const throwable = v => () => service.defineSchema({$id: v});
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
      const service = new TrieRouterJsonSchema();
      const mySchema = {
        $id: 'MyTestSchema',
        type: 'object',
        properties: {foo: {type: 'string'}},
      };
      service.defineSchema(mySchema);
      const paramsValidator = service
        ._getParametersAjvInstance()
        .getSchema('MyTestSchema');
      const reqBodyValidator = service
        ._getRequestBodyAjvInstance()
        .getSchema('MyTestSchema');
      const resBodyValidator = service
        ._getResponseBodyAjvInstance()
        .getSchema('MyTestSchema');
      expect(paramsValidator).to.be.a('function');
      expect(reqBodyValidator).to.be.a('function');
      expect(resBodyValidator).to.be.a('function');
    });

    it('should return the current instance for chaining', function () {
      const service = new TrieRouterJsonSchema();
      const mySchema = {$id: 'MyChainSchema', type: 'object'};
      const result = service.defineSchema(mySchema);
      expect(result).to.be.eq(service);
    });
  });

  describe('onDefineRouteJsonSchemaHook', function () {
    it('should ignore if a route definition lacks the or "jsonSchema" keywords', function () {
      const container = new ServiceContainer();
      const service = container.get(TrieRouterJsonSchema);
      onDefineRouteJsonSchemaHook({method: 'GET', path: '/'}, container);
      onDefineRouteJsonSchemaHook({meta: {}}, container);
      onDefineRouteJsonSchemaHook({meta: {jsonSchema: false}}, container);
      expect(service._parametersValidatiors.size).to.be.eq(0);
      expect(service._requestBodyValidatiors.size).to.be.eq(0);
      expect(service._responseBodyValidatiors.size).to.be.eq(0);
    });
  });
});
