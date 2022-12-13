import { useMemo } from 'react';

/**
 * Simplifies the structure of the GraphQL-Response-Objects that got more complexity with Strapi v4.
 * The `data` and `attributes` layers in between the relevant data get removed.
 * @see https://stackoverflow.com/a/68047417
 */
export const flattenQueryResponseData = (queryResponseData?: {
  [key: string]: any;
}): { [key: string]: any } | undefined => {
  if (!queryResponseData) return;

  if (queryResponseData instanceof Array) {
    // If the data array is plainly passed, directly initiate recursion inside contained entities.
    // Especially useful for mocking in tests when you want to define entities without needing to
    // extra-wrap these inside a `data` key.
    return queryResponseData.map(flattenQueryResponseData);
  }

  let result: any = {};
  for (const [key, value] of Object.entries<unknown>(queryResponseData)) {
    if (key === '__typename') {
      continue;
    }
    if (key !== 'data' && key !== 'attributes' && value instanceof Object) {
      // Keep the semantically relevant key and initiate recursion within its value object.
      result[key] = flattenQueryResponseData(value);
    } else if (key === 'data' && value instanceof Array) {
      // If multiple entities were requested, replace `data` key with the array of contained entities
      // and initiate recursion inside these.
      result = value.map(flattenQueryResponseData);
    } else if (key === 'data' && value instanceof Object) {
      // If only a single entity was requested, replace `data` key with this entity (object)
      // and initiate recursion inside it.
      result = flattenQueryResponseData(value);
    } else if (key === 'data' && !value) {
      // If there is no value under the `data` key, replace this key with `null`.
      result = null;
    } else if (key === 'attributes' && value instanceof Object) {
      result = {
        // Replace the `attributes` key with its value object
        // and initiate recursion within this object.
        ...flattenQueryResponseData(value),
        // Note that we need to keep other data on the same level as the `attributes` key
        // (that is currently only the `id` key with its value).
        ...result,
      };
    } else {
      // Keep the original key/value pair in the case of primitive data.
      result[key] = value;
    }
  }
  return result;
};

/**
 * Implements using {@link flattenQueryResponseData} and {@link mergeVerifiedWithUnverifiedData}
 * as a custom React-Hook, which includes memoization of the result based on the input.
 */
export const useSimplifiedQueryResponseData = (queryResponseData?: { [key: string]: any }) =>
  useMemo(
    () => mergeVerifiedWithUnverifiedData(flattenQueryResponseData(queryResponseData)),
    [queryResponseData]
  );

const VERIFIED_PREFIX = 'verified_';

/**
 * Recursively merges the data of verified and unverified relations.<br>
 * When it comes to an *n:m* relation, it will output an array first filled with the verified entities
 * and the unverified ones afterwords.<br>
 * When it comes to a *1:n* relation, it will always use the verified entity if there is one.<br>
 * **Important note**: the input data needs to be flattened via {@link flattenQueryResponseData} before!
 */
export const mergeVerifiedWithUnverifiedData = (flatQueryResponseData?: {
  [key: string]: any;
}): { [key: string]: any } | undefined => {
  if (!flatQueryResponseData) return;

  if (flatQueryResponseData instanceof Array) {
    // If the data array is plainly passed, directly initiate recursion inside contained entities.
    return flatQueryResponseData.map(mergeVerifiedWithUnverifiedData);
  }

  const result: any = {};
  for (const [key, value] of Object.entries<unknown>(flatQueryResponseData)) {
    if (!key.startsWith(VERIFIED_PREFIX) && value instanceof Object) {
      const alreadyStoredResult = result[key];
      result[key] = alreadyStoredResult
        ? // If there is already a result stored under that key,
          // it must have been put there by the function before.
          alreadyStoredResult
        : // Otherwise, keep initiate further recursion inside the value object.
          mergeVerifiedWithUnverifiedData(value);
    } else if (key.startsWith(VERIFIED_PREFIX) && value instanceof Array) {
      // Omit the verified prefix to get the regular key of the relation
      const regularKey = key.slice(VERIFIED_PREFIX.length);
      const regularData = flatQueryResponseData[regularKey];

      // First add verified entities to the result.
      let mergedEntities = value.map(entity => ({ ...entity, verified: true }));

      if (regularData && regularData instanceof Array) {
        // Merge verified with unverified entities.
        mergedEntities = [
          ...mergedEntities,
          // Mark regular entities as unverified.
          ...regularData.map(entity => ({ ...entity, verified: false })),
        ];
      }

      // Store the merged entities under the regular key and initiate further recursion.
      result[regularKey] = mergedEntities.map(mergeVerifiedWithUnverifiedData);
    } else if (key.startsWith(VERIFIED_PREFIX) && value instanceof Object) {
      // Omit the verified prefix to get the regular key of the relation.
      const regularKey = key.slice(VERIFIED_PREFIX.length);

      // Always use the verified entity (no matter what the unverified was)
      const entityToUse = { ...value, verified: true };

      // Store the chosen entity under the regular key and initiate further recursion.
      result[regularKey] = mergeVerifiedWithUnverifiedData(entityToUse);
    } else if (key.startsWith(VERIFIED_PREFIX) && !value) {
      // Omit the verified prefix to get the regular key of the relation.
      const regularKey = key.slice(VERIFIED_PREFIX.length);
      const regularData = flatQueryResponseData[regularKey];

      let entityToUse: { [key: string]: any } | undefined;
      if (regularData instanceof Object) {
        // If the verified data has no value, use the unverified one (if it exists).
        entityToUse = { ...regularData, verified: false };
      }

      // Store the chosen entity under the regular key and initiate further recursion.
      result[regularKey] = mergeVerifiedWithUnverifiedData(entityToUse);
    } else {
      // Keep the original key/value pair in the case of primitive data.
      result[key] = value;
    }
  }
  return result;
};
