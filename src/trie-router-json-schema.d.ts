import {JsonSchema} from './json-schema.js';
import {Service, ServiceContainer} from '@e22m4u/js-service';

/**
 * Route json schema.
 */
export interface RouteJsonSchema {
  params?: JsonSchema;
  query?: JsonSchema;
  headers?: JsonSchema;
  cookies?: JsonSchema;
  body?: JsonSchema;
  responses?: {[statusCode: string]: JsonSchema};
}

/**
 * Расширение интерфейса RouteMeta.
 */
declare module '@e22m4u/js-trie-router' {
  export interface RouteMeta {
    jsonSchema?: RouteJsonSchema | boolean;
  }
}

/**
 * Trie router json schema options.
 */
export type TrieRouterJsonSchemaOptions = {
  noRequestValidation: boolean;
  noResponseValidation: boolean;
  noParseParametersJson: boolean;
  noCoerceTypesInParameters: boolean;
  noCoerceTypesInRequestBody: boolean;
  noCoerceTypesInResponseBody: boolean;
  noDefaultValuesInParameters: boolean;
  noDefaultValuesInRequestBody: boolean;
  noDefaultValuesInResponseBody: boolean;
};

/**
 * Trie router json schema.
 */
export class TrieRouterJsonSchema extends Service {
  /**
   * Constructor.
   *
   * @param container
   * @param options
   */
  constructor(
    container: ServiceContainer,
    options?: TrieRouterJsonSchemaOptions,
  );
}
