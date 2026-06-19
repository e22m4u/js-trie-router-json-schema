import {expect} from 'chai';
import {ServiceContainer} from '@e22m4u/js-service';

import {
  TrieRouterJsonSchema,
  onDefineRouteJsonSchemaHook,
} from './trie-router-json-schema.js';

describe('TrieRouterJsonSchema', function () {
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
