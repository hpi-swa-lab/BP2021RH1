import { createHttpLink, from } from '@apollo/client';
import { onError as createErrorLink } from '@apollo/client/link/error';
import { isEmpty, unionWith } from 'lodash';
import { AlertOptions, AlertType } from '../components/provider/AlertProvider';
import type { FlatUploadFile } from '../types/additionalFlatTypes';

const OPERATIONS_WITH_OWN_ERROR_HANDLING = ['login'];

const apiBase = import.meta.env.VITE_REACT_APP_API_BASE;

export const root = document.getElementById('root')!;

export enum PictureOrigin {
  LOCAL,
  REMOTE,
}

export const asApiPath = (pathEnding: string) => {
  // Removes any multiple occurrences of a "/"
  const formattedPathEnding = `/${pathEnding}`.replace(/\/+/gm, '/');
  return `${apiBase}${formattedPathEnding}`;
};

type UploadOptions = {
  highQuality?: boolean;
  pictureOrigin?: PictureOrigin;
  fallback?: string;
};

export const asUploadPath = (
  media: FlatUploadFile | undefined,
  options: UploadOptions = { highQuality: true, pictureOrigin: PictureOrigin.REMOTE, fallback: '' }
) => {
  const { highQuality, pictureOrigin, fallback } = options;

  const defaultUrl: string =
    (media?.formats?.small || media?.formats?.thumbnail || media)?.url || fallback;

  const imgSrc = `${highQuality ? media?.url ?? defaultUrl : defaultUrl}?updatedAt=${
    (media?.updatedAt ?? 'unknown') as string
  }`;

  const onCdn = media?.provider === 'strapi-provider-upload-aws-s3-advanced';

  if (onCdn) return imgSrc;
  if (pictureOrigin === PictureOrigin.LOCAL || defaultUrl === fallback) return defaultUrl;

  return asApiPath(imgSrc);
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
  let httpLink = createHttpLink({
    uri: `${apiBase}/graphql`,
    headers: {
      authorization: token ? `Bearer ${token}` : '',
    },
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
