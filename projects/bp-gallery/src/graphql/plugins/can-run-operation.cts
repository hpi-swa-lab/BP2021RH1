import { CodegenPlugin } from '@graphql-codegen/plugin-helpers';
import {
  ClientSideBasePluginConfig,
  ClientSideBaseVisitor,
  RawClientSideBasePluginConfig,
} from '@graphql-codegen/visitor-plugin-common';
import { DocumentNode, OperationDefinitionNode, concatAST, visit } from 'graphql';

// For every GraphQL operation the app uses, this generates useCanRun<Operation> and
// useCanRunMultiple<Operation>s. They ask Strapi whether the current user may run that operation
// with the given variables, so the UI can hide what the user isn't allowed to do. The checking
// itself is in hooks/can-run-operation.hook.ts; the generated hooks only pass the operation's text
// and the caller's variables on to it.
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
      prepend: ["import { useCanRunOperation } from '../hooks/can-run-operation.hook';"],
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

    // Strapi checks a login with the permissions of the user trying to log in, so whether the
    // current user may log in at all says nothing about it.
    const checkAtAllFirst = node.name?.value !== 'login';
    const hookArguments = `
      operation: ${documentVariableName}.loc?.source.body ?? '',
      checkAtAllFirst: ${checkAtAllFirst.toString()},
      assumeCanRunOnError: ${this.config.assumeCanRunOnError.toString()},`;
    const optionsType = `Omit<
      Apollo.QueryHookOptions<CanRunOperationQuery, CanRunOperationQueryVariables>,
      'variables'
    >`;

    this.generatedHooks.push(`
      export function useCanRun${singleName}(
        options?: ${optionsType} & {
          variables?: Partial<${operationVariablesTypes}>;
          withSomeVariables?: boolean;
        }
      ) {
        const { variables, withSomeVariables, ...queryOptions } = options ?? {};
        const { canRunMultiple, loading } = useCanRunOperation({
          ${hookArguments}
          variableSets: [variables ?? {}],
          withSomeVariables,
          options: queryOptions,
        });
        return { canRun: canRunMultiple[0], loading };
      }

      export function useCanRun${multipleName}(
        options: ${optionsType} & {
          variableSets: Partial<${operationVariablesTypes}>[];
        }
      ) {
        const { variableSets, ...queryOptions } = options;
        return useCanRunOperation({
          ${hookArguments}
          variableSets,
          options: queryOptions,
        });
      }
    `);

    // we don't use the transformed AST, so this doesn't matter
    return '';
  }
}
