import {
  MutationHookOptions,
  MutationTuple,
  OperationVariables,
  QueryHookOptions,
  QueryResult,
} from '@apollo/client';

export type Query<Variables extends OperationVariables> = (
  options: QueryHookOptions<any, Variables>
) => QueryResult<Record<string, any>, Variables>;

export type CanRunQuery<Variables extends OperationVariables> = (
  options: Omit<QueryHookOptions<any, Variables & { operation: string }>, 'variables'> & {
    variables: Variables;
  }
) => { canRun: boolean; loading: boolean };

export type CanRunMultipleQuery<VariableSet extends OperationVariables> = (
  options: Omit<QueryHookOptions<any, VariableSet & { operation: string }>, 'variables'> & {
    variableSets: Partial<VariableSet>[];
  }
) => { canRunMultiple: (boolean | null)[]; loading: boolean };

export type Mutation<Variables extends OperationVariables> = (
  options: MutationHookOptions<any, Variables>
) => MutationTuple<Record<string, any>, Variables>;
