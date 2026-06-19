/**
 * JSON type.
 * https://json-schema.org/draft/2020-12/json-schema-core#section-4.2.1
 */
export declare const JSONType: {
  STRING: 'string';
  NUMBER: 'number';
  INTEGER: 'integer';
  BOOLEAN: 'boolean';
  OBJECT: 'object';
  ARRAY: 'array';
  NULL: 'null';
};

export type JSONType = (typeof JSONType)[keyof typeof JSONType];

/**
 * JSON Schema Document.
 * A JSON Schema MUST be an object or a boolean.
 * https://json-schema.org/draft/2020-12/json-schema-core#section-4.3
 */
export type JSONSchema = JSONSchemaObject | boolean;

/**
 * JSON Schema Object.
 * Represents the structured definition of JSON Schema Draft 2020-12.
 */
export type JSONSchemaObject = {
  // -------------------------------------------------------------------
  // Core Vocabulary
  // https://json-schema.org/draft/2020-12/json-schema-core#section-8
  // -------------------------------------------------------------------
  $schema?: string;
  $id?: string;
  $ref?: string;
  $anchor?: string;
  $dynamicRef?: string;
  $dynamicAnchor?: string;
  $vocabulary?: {[uri: string]: boolean};
  $comment?: string;
  $defs?: {[key: string]: JSONSchema};

  // -------------------------------------------------------------------
  // Applicator Vocabulary (Applying Subschemas)
  // https://json-schema.org/draft/2020-12/json-schema-core#section-10
  // -------------------------------------------------------------------

  // Logic
  allOf?: JSONSchema[];
  anyOf?: JSONSchema[];
  oneOf?: JSONSchema[];
  not?: JSONSchema;

  // Conditional
  if?: JSONSchema;
  then?: JSONSchema;
  else?: JSONSchema;
  dependentSchemas?: {[key: string]: JSONSchema};

  // Arrays
  prefixItems?: JSONSchema[];
  /**
   * В Draft 2020-12 `items` больше не принимает массив схем.
   * Массив схем теперь обрабатывается через `prefixItems`.
   */
  items?: JSONSchema;
  contains?: JSONSchema;

  // Objects
  properties?: {[name: string]: JSONSchema};
  patternProperties?: {[pattern: string]: JSONSchema};
  additionalProperties?: JSONSchema;
  propertyNames?: JSONSchema;

  // -------------------------------------------------------------------
  // Unevaluated Locations Vocabulary
  // https://json-schema.org/draft/2020-12/json-schema-core#section-11
  // -------------------------------------------------------------------
  unevaluatedItems?: JSONSchema;
  unevaluatedProperties?: JSONSchema;

  // -------------------------------------------------------------------
  // Validation Vocabulary
  // (Defined in the companion validation specification)
  // -------------------------------------------------------------------

  // Any Type
  type?: JSONType | JSONType[];
  enum?: unknown[];
  const?: unknown;

  // Numbers
  multipleOf?: number;
  maximum?: number;
  exclusiveMaximum?: number;
  minimum?: number;
  exclusiveMinimum?: number;

  // Strings
  maxLength?: number;
  minLength?: number;
  pattern?: string;

  // Arrays
  maxItems?: number;
  minItems?: number;
  uniqueItems?: boolean;
  maxContains?: number;
  minContains?: number;

  // Objects
  maxProperties?: number;
  minProperties?: number;
  required?: string[];
  dependentRequired?: {[key: string]: string[]};

  // -------------------------------------------------------------------
  // Format Vocabulary
  // -------------------------------------------------------------------
  format?: string;

  // -------------------------------------------------------------------
  // Meta-Data and Annotations Vocabulary
  // -------------------------------------------------------------------
  title?: string;
  description?: string;
  default?: unknown;
  deprecated?: boolean;
  readOnly?: boolean;
  writeOnly?: boolean;
  examples?: unknown[];

  // -------------------------------------------------------------------
  // Content Vocabulary (String-encoded data)
  // -------------------------------------------------------------------
  contentMediaType?: string;
  contentEncoding?: string;
  contentSchema?: JSONSchema;

  // -------------------------------------------------------------------
  // Extensibility
  // "A JSON Schema MAY contain properties which are not schema keywords."
  // -------------------------------------------------------------------
  [keyword: string]: unknown;
};
