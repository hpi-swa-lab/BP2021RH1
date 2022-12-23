import { isEmpty } from 'lodash';
import { asSearchPath, isValidYear } from '../SearchView';
import { SearchType } from './search-filters';

const isDuplicatedSearchParam = (element: string, type: string, prevParams: URLSearchParams) => {
  let isDuplicate = false;
  const prevParamsIterator = prevParams.entries();
  let nextParam = prevParamsIterator.next();
  while (!nextParam.done) {
    if (nextParam.value[1] === element && nextParam.value[0] === type) isDuplicate = true;
    nextParam = prevParamsIterator.next();
  }

  return isDuplicate;
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
    if (!isDuplicatedSearchParam(element, newParamType, searchParams) && !isEmpty(element)) {
      searchParams.append(newParamType, element);
    }
  });
  return { searchPath: asSearchPath(searchParams), isValid: true };
};
