import { ApolloLink, from } from '@apollo/client';
import { BatchHttpLink } from '@apollo/client/link/batch-http';
import { onError as createErrorLink } from '@apollo/client/link/error';
import { isEmpty, unionWith } from 'lodash';
import { AlertOptions, AlertType } from '../components/provider/AlertProvider';

const OPERATIONS_WITH_OWN_ERROR_HANDLING = ['login'];

const apiBase = import.meta.env.VITE_REACT_APP_API_BASE;
export const root = document.getElementById('root')!;

export const asApiPath = (pathEnding: string) => {
  // Removes any multiple occurrences of a "/"
  const formattedPathEnding = `/${pathEnding}`.replace(/\/+/gm, '/');
  return `${apiBase}${formattedPathEnding}`;
};

/**
 * Creates the link-chain for the {@link ApolloClient} consisting of:
 * - an HTTP-Link for using authentication via JWT and
 * - an Error-Link for globally catching errors and showing these in an Alert.
 * @param token JWT input, pass null to reset it.
 * @param openAlert the callback to open our Alert, can be obtained from the AlertContext
 */
export const buildHttpLink = (
  token: string | null,
  openAlert?: (alertOptions: AlertOptions) => void
) => {
  let httpLink: ApolloLink = new BatchHttpLink({
    uri: `${apiBase}/graphql`,
    headers: {
      authorization: token ? `Bearer ${token}` : '',
    },
    batchMax: 50,
  });

  if (openAlert) {
    const errorLink = createErrorLink(({ graphQLErrors, networkError, operation }) => {
      if (OPERATIONS_WITH_OWN_ERROR_HANDLING.includes(operation.operationName)) return;

      const errorMessages = [];
      if (networkError) errorMessages.push(networkError);
      if (graphQLErrors) graphQLErrors.forEach(({ message }) => errorMessages.push(message));

      if (isEmpty(errorMessages)) return;

      openAlert({
        alertType: AlertType.ERROR,
        message: errorMessages.join('\n'),
        duration: 5000,
      });
    });

    httpLink = from([errorLink, httpLink]);
  }

  return httpLink;
};

type Ref = { __ref: string };
type MergeInput = { __typename: string; data: Ref[] };

export const mergeByRef = (existing: Ref[] | undefined = undefined, incoming: Ref[]): Ref[] =>
  unionWith<Ref>(existing ?? [], incoming, (a, b) => a.__ref === b.__ref);

export const mergeByRefWrappedInData = (
  existing: MergeInput | undefined = undefined,
  incoming: MergeInput
): MergeInput => ({
  ...incoming,
  data: mergeByRef(existing?.data, incoming.data),
});
