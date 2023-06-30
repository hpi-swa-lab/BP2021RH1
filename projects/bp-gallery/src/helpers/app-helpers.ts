import { ApolloLink, from } from '@apollo/client';
import { BatchHttpLink } from '@apollo/client/link/batch-http';
import { onError as createErrorLink } from '@apollo/client/link/error';
import { createUploadLink } from 'apollo-upload-client';
import { canRunOperation } from 'bp-graphql/build/operations';
import { extractFiles } from 'extract-files';
import { Maybe } from 'graphql/jsutils/Maybe';
import { TFunction } from 'i18next';
import { unionWith } from 'lodash';
import { AlertOptions, AlertType } from '../components/provider/AlertProvider';
import { translateErrorMessage } from '../i18n';
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

const errorToStrings = (error: unknown): string[] => {
  if (!error) {
    return [];
  }
  if (typeof error === 'string') {
    return [error];
  }
  if (error instanceof Array) {
    return error.flatMap(element => errorToStrings(element));
  }
  const errors: string[] = [];
  if (typeof error === 'object') {
    // ApolloError
    if ('clientErrors' in error) {
      errors.push(...errorToStrings(error.clientErrors));
    }
    if ('graphQLErrors' in error) {
      errors.push(...errorToStrings(error.graphQLErrors));
    }
    if ('networkError' in error) {
      errors.push(...errorToStrings(error.networkError));
    }

    // { result: { errors: [...] } }
    if (
      errors.length === 0 &&
      'result' in error &&
      typeof error.result === 'object' &&
      error.result &&
      'errors' in error.result &&
      error.result.errors instanceof Array
    ) {
      for (const resultError of error.result.errors) {
        errors.push(...errorToStrings(resultError));
      }
    } else if ('message' in error) {
      errors.push(...errorToStrings(error.message));
    }
  }
  return errors;
};

export const errorToTranslatedString = (error: unknown, t: TFunction, context?: string) => {
  return Array.from(errorToStrings(error))
    .map(message => translateErrorMessage(message, t, context))
    .join('\n');
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
  alert?: {
    openAlert: (alertOptions: AlertOptions) => void;
    t: TFunction;
  },
  anonymousId?: string | null
) => {
  const options = {
    uri: `${apiBase}/graphql`,
    headers: {
      'Access-Control-Request-Headers': 'anonymousId',
      authorization: token ? `Bearer ${token}` : '',
      ...(typeof anonymousId === 'string'
        ? {
            anonymousId,
          }
        : {}),
    },
  };
  const batchedOperationNames = [canRunOperation].map(operation => operation.document.name);
  let httpLink = ApolloLink.split(
    operation =>
      !batchedOperationNames.includes(operation.operationName) ||
      extractFiles(operation).files.size > 0,
    createUploadLink(options),
    new BatchHttpLink({
      ...options,
      batchMax: 50,
    })
  );

  const growthbookLink = new ApolloLink((operation, forward) => {
    return forward(operation).map(response => {
      const experimentData: { experimentId: string; variationId: string }[] | null = JSON.parse(
        (operation.getContext().response as Response).headers.get('x-growthbook') ?? 'null'
      );
      experimentData?.forEach(experiment => {
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

  if (alert) {
    const { openAlert, t } = alert;
    const errorLink = createErrorLink(error => {
      if (OPERATIONS_WITH_OWN_ERROR_HANDLING.includes(error.operation.operationName)) return;

      const errorMessage = errorToTranslatedString(error, t);
      if (errorMessage) {
        openAlert({
          alertType: AlertType.ERROR,
          message: errorMessage,
          duration: 5000,
        });
      }
    });

    httpLink = from([errorLink, httpLink]);
  }

  return httpLink;
};

type Ref = { __ref: string };
type MergeInput = { __typename: string; data: Ref[] };

export const mergeByRef = (
  existing: Ref[] | undefined = undefined,
  incoming: Ref[],
  args: any
): Ref[] => {
  if (args?.pagination?.start === 0) {
    return incoming;
  }
  return unionWith<Ref>(existing ?? [], incoming, (a, b) => a.__ref === b.__ref);
};

export const mergeByRefWrappedInData = (
  existing: MergeInput | undefined = undefined,
  incoming: MergeInput,
  { args }: any
): MergeInput => ({
  ...incoming,
  data: mergeByRef(existing?.data, incoming.data, args),
});
