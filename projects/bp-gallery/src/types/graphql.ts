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

type BaseCanRunOptions<Variables extends OperationVariables> = Omit<
  QueryHookOptions<any, Variables & { operation: string }>,
  'variables'
>;

export type CanRunQuery<Variables extends OperationVariables> = (
  options: BaseCanRunOptions<Variables> & {
    variables: Variables;
  }
) => { canRun: boolean; loading: boolean };

export type CanRunMultipleQuery<VariableSet extends OperationVariables> = (
  options: BaseCanRunOptions<VariableSet> & {
    variableSets: Partial<VariableSet>[];
  }
) => { canRunMultiple: (boolean | null)[]; loading: boolean };

export type Mutation<Variables extends OperationVariables> = (
  options: MutationHookOptions<any, Variables>
) => MutationTuple<Record<string, any>, Variables>;
