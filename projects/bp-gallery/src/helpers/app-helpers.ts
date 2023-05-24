import { ApolloLink, createHttpLink, from } from '@apollo/client';
import { onError as createErrorLink } from '@apollo/client/link/error';
import { Maybe } from 'graphql/jsutils/Maybe';
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

export const asUploadPath = (media: FlatUploadFile | undefined, options: UploadOptions = {}) => {
  const { highQuality = true, pictureOrigin = PictureOrigin.REMOTE, fallback = '' } = options;

  const previewUrl = (media?.formats?.small ?? media?.formats?.thumbnail)?.url as Maybe<string>;

  // depending on highQuality, prioritize either full resolution URL or reduced resolution URL, fallback to the other one or custom fallback
  const imgSrc = (highQuality ? media?.url ?? previewUrl : previewUrl ?? media?.url) ?? fallback;

  // necessary to always get latest version of the picture from CDN/Strapi (after e.g. using the image editor)
  const imgSrcWithParams = `${imgSrc}?updatedAt=${(media?.updatedAt ?? '') as string}`;

  const onCdn = media?.provider === 'strapi-provider-upload-aws-s3-advanced';

  if (pictureOrigin === PictureOrigin.LOCAL || imgSrc === fallback) return imgSrc;
  if (onCdn) return imgSrcWithParams;

  return asApiPath(imgSrcWithParams);
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
  openAlert?: (alertOptions: AlertOptions) => void,
  anonymousId?: string | null
) => {
  let httpLink = createHttpLink({
    uri: `${apiBase}/graphql`,
    headers: {
      'Access-Control-Request-Headers': 'anonymousId',
      authorization: token ? `Bearer ${token}` : '',
      anonymousId: anonymousId,
    },
  });

  const growthbookLink = new ApolloLink((operation, forward) => {
    return forward(operation).map(response => {
      const experimentData = JSON.parse(
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-call
        operation.getContext().response.headers.get('x-growthbook')
      );
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      experimentData?.map((experiment: { experimentId: string; variationId: string }) => {
        const w: any = window;
        const _paq: Array<any> = (w._paq = w._paq || []);
        _paq.push([
          'trackEvent',
          'ExperimentViewed',
          experiment.experimentId,
          experiment.variationId,
        ]);
      });
      return response;
    });
  });

  httpLink = from([growthbookLink, httpLink]);

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
