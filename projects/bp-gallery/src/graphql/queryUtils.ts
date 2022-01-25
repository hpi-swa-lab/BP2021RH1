import { useMemo } from 'react';

/**
 * Simplifies the structure of the GraphQL-Response-Objects that got more complexity with Strapi v4.
 * The `data` and `attributes` layers in between the relevant data get removed.
 * @see https://stackoverflow.com/a/68047417
 */
export const flattenQueryResponseData = (queryResponseData?: { [key: string]: any }): any => {
  if (!queryResponseData) return;

  if (queryResponseData instanceof Array) {
    // If the data array is plainly passed, directly initiate recursion inside contained entities.
    // Especially useful for mocking in tests when you want to define entities without needing to
    // extra-wrap these inside a `data` key.
    return queryResponseData.map(flattenQueryResponseData);
  }

  let result: any = {};
  for (const [key, value] of Object.entries<unknown>(queryResponseData)) {
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
 * Implements using {@link flattenQueryResponseData} as a custom React-Hook,
 * which includes memoization of the result based on the input.
 */
export const useFlatQueryResponseData = (queryResponseData?: { [key: string]: any }) =>
  useMemo(() => flattenQueryResponseData(queryResponseData), [queryResponseData]);
