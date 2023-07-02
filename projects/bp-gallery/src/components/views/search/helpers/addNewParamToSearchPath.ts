// import { isEmpty } from 'lodash';
import { SearchType } from './search-filters';
import { fromURLSearchParam, toURLSearchParam } from './url-search-params';

export const asSearchPath = (searchParams: URLSearchParams): string => {
  return `/search?${searchParams.toString()}`;
};

export const isValidYear = (searchRequest: string) => {
  return parseInt(searchRequest) && (searchRequest.length === 2 || searchRequest.length === 4);
};

const isDuplicatedSearchParam = (element: string, type: string, prevParams: URLSearchParams) => {
  return !!Array.from(prevParams.entries()).find(
    ([paramType, paramElement]) =>
      paramElement === element && fromURLSearchParam(paramType) === type
  );
};

export const addNewParamToSearchPath = (
  newParamType: string,
  searchRequest: string,
  prevParams?: URLSearchParams
): {
  isValid: boolean;
  searchPath: string;
} => {
  const searchParams = prevParams ? prevParams : new URLSearchParams();
  const paramValues = searchRequest.split(' ');

  if (newParamType === SearchType.TIME_RANGE) {
    if (!isValidYear(searchRequest))
      return { searchPath: asSearchPath(searchParams), isValid: false };
  }

  paramValues.forEach(element => {
    if (!isDuplicatedSearchParam(element, newParamType, searchParams) /* && !isEmpty(element) */) {
      searchParams.append(toURLSearchParam(newParamType), element);
    }
  });
  return { searchPath: asSearchPath(searchParams), isValid: true };
};
