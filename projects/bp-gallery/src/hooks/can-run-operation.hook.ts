import { QueryHookOptions, QueryResult } from '@apollo/client';
import {
  CanRunOperationQuery,
  CanRunOperationQueryVariables,
  useCanRunOperationQuery,
} from '../graphql/APIConnector';
import { useAuth } from './context-hooks';

type CanRunOperationOptions = Omit<
  QueryHookOptions<CanRunOperationQuery, CanRunOperationQueryVariables>,
  'variables'
>;

const answer = (
  query: QueryResult<CanRunOperationQuery, CanRunOperationQueryVariables>,
  index: number,
  assumeCanRunOnError: boolean
) =>
  // Not loading and no answer means the check failed.
  query.data?.canRunOperation?.[index] ?? (query.loading ? false : assumeCanRunOnError);

export const useCanRunOperation = ({
  operation,
  variableSets,
  withSomeVariables,
  checkAtAllFirst,
  assumeCanRunOnError,
  options,
}: {
  operation: string;
  variableSets: Record<string, unknown>[];
  withSomeVariables?: boolean;
  checkAtAllFirst: boolean;
  assumeCanRunOnError: boolean;
  options: CanRunOperationOptions;
}) => {
  // Strapi ignores this variable. Sending it keeps a check made after a login or logout from
  // joining a request for the same check that is still in flight from before, and the cache key
  // of canRunOperation (App.tsx) keeps answers for different users apart. Until the saved login
  // is confirmed, userId is unknown, so checks wait for it instead of being asked twice.
  const { userId, loading: authLoading } = useAuth();
  const user = userId ?? '';
  const skip = authLoading || !!options.skip;

  // Most visitors may not run an operation with any variables, so asking once whether the user may
  // run it at all (cached for the session) spares them a check per picture, comment or tag. Strapi
  // only allows specific variables if the user has some permission for the operation, so a no here
  // is final.
  const atAllVariables = { operation, variableSets: [{}], withSomeVariables: true, user };
  const atAll = useCanRunOperationQuery({
    ...options,
    variables: atAllVariables,
    skip: skip || !checkAtAllFirst || !!withSomeVariables,
  });
  const allowedAtAll =
    !checkAtAllFirst || !!withSomeVariables || answer(atAll, 0, assumeCanRunOnError);

  const variables = { operation, variableSets, withSomeVariables, user };
  const query = useCanRunOperationQuery({
    ...options,
    variables,
    skip: skip || !allowedAtAll,
  });

  return {
    canRunMultiple: variableSets.map(
      (_, index) => !authLoading && allowedAtAll && answer(query, index, assumeCanRunOnError)
    ),
    loading: authLoading || atAll.loading || query.loading,
  };
};
