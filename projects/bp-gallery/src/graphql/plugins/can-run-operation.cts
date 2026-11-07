import { CodegenPlugin } from '@graphql-codegen/plugin-helpers';
import {
  ClientSideBasePluginConfig,
  ClientSideBaseVisitor,
  RawClientSideBasePluginConfig,
} from '@graphql-codegen/visitor-plugin-common';
import { DocumentNode, OperationDefinitionNode, concatAST, visit } from 'graphql';

const plugin = {
  plugin(schema, documents, config) {
    const combinedAST = concatAST(
      documents.map(v => v.document).filter((document): document is DocumentNode => !!document)
    );

    // the fragments aren't needed because we don't output
    // the documents (the other plugins do that)
    const fragments: never[] = [];

    const visitor = new Visitor(schema, fragments, config, config);
    visit(combinedAST, visitor);

    return {
      content: visitor.generatedHooks.join('\n'),
    };
  },
} satisfies CodegenPlugin<Config>;

const pluginEntry = plugin.plugin;

export { pluginEntry as plugin };

type Config = {
  assumeCanRunOnError: boolean;
};

class Visitor extends ClientSideBaseVisitor<
  RawClientSideBasePluginConfig & Config,
  ClientSideBasePluginConfig & Config
> {
  public generatedHooks: string[] = [];

  protected buildOperation(
    node: OperationDefinitionNode,
    documentVariableName: string,
    operationType: string,
    _operationResultType: string,
    operationVariablesTypes: string,
    _hasRequiredVariables: boolean
  ): string {
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

    const generateHook = (
      name: string,
      optionsAreOptional: boolean,
      variablesType: string,
      variableSetsValue: string,
      returnStatement: string
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
          const { data, loading } = useCanRunOperationQuery({
            ...options,
            variables: {
              operation: ${documentVariableName}.loc?.source.body ?? '',
              variableSets: ${variableSetsValue},
            },
          });
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
