'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.plugin = void 0;
const visitor_plugin_common_1 = require('@graphql-codegen/visitor-plugin-common');
const graphql_1 = require('graphql');
const plugin = {
  plugin(schema, documents, config) {
    const combinedAST = (0, graphql_1.concatAST)(
      documents.map(v => v.document).filter(document => !!document)
    );
    // the fragments aren't needed because we don't output
    // the documents (the other plugins do that)
    const fragments = [];
    const visitor = new Visitor(schema, fragments, config, config);
    (0, graphql_1.visit)(combinedAST, visitor);
    const imports = Array.from(visitor.imports).sort();
    return {
      prepend: imports,
      content: visitor.generatedHooks.join('\n'),
    };
  },
};
const pluginEntry = plugin.plugin;
exports.plugin = pluginEntry;
class Visitor extends visitor_plugin_common_1.ClientSideBaseVisitor {
  constructor() {
    super(...arguments);
    this.generatedHooks = [];
    this.imports = new Set();
  }
  buildOperation(
    node,
    documentVariableName,
    operationType,
    _operationResultType,
    operationVariablesTypes,
    _hasRequiredVariables
  ) {
    const operationName = this.convertName(node);
    const singleName = operationName + operationType;
    const multipleName =
      'Multiple' + operationName + (operationType === 'Query' ? 'Queries' : operationType + 's');
    const fallbackCanRun = `loading ? false : ${
      // Not loading and no data means error.
      // We treat the case that there is actually no error
      // and the query field canRunOperation just returns
      // undefined (which shouldn't happen) as an error.
      this.config.assumeCanRunOnError.toString()
    }`;
    this.imports.add("import { useAuthChangeEffect } from '../hooks/auth-change-effect.hook';");
    const generateHook = (
      name,
      optionsAreOptional,
      variablesType,
      variableSetsValue,
      returnStatement
    ) => {
      this.generatedHooks.push(`
        export function useCanRun${name}(
          options${optionsAreOptional ? '?' : ''}: Omit<
            Apollo.QueryHookOptions<CanRunOperationQuery, CanRunOperationQueryVariables>,
            'variables'
          > & {
            ${variablesType};
          }
        ) {
          const { data, loading, refetch } = useCanRunOperationQuery({
            ...options,
            variables: {
              operation: ${documentVariableName}.loc?.source.body ?? '',
              variableSets: ${variableSetsValue},
            },
          });
          useAuthChangeEffect(refetch);
          ${returnStatement}
        }
      `);
    };
    generateHook(
      singleName,
      true,
      `variables?: Partial<${operationVariablesTypes}>,
       withSomeVariables?: boolean`,
      `[options?.variables ?? {}],
       withSomeVariables: options?.withSomeVariables`,
      `return { canRun: data?.canRunOperation?.[0] ?? (${fallbackCanRun}), loading };`
    );
    generateHook(
      multipleName,
      false,
      `variableSets: Partial<${operationVariablesTypes}>[]`,
      `options.variableSets`,
      `return {
        canRunMultiple:
          data?.canRunOperation ?? options.variableSets.map(_ => ${fallbackCanRun}),
        loading,
      };`
    );
    // we don't use the transformed AST, so this doesn't matter
    return '';
  }
}
