import React from 'react';
import { Chip } from '@mui/material';
import { useHistory } from 'react-router-dom';
import { History } from 'history';
import { useTranslation } from 'react-i18next';
import { asSearchPath, SearchType } from './SearchView';

type SearchParam = { type: string; value: string };
type SearchParams = SearchParam[];

const SearchBreadcrumbs = ({ searchParams }: { searchParams: URLSearchParams }) => {
  const { t } = useTranslation();
  const history: History = useHistory();
  const searchParamValues: SearchParams = [];

  const searchParamsIterator = searchParams.entries();
  let nextParam = searchParamsIterator.next();
  while (!nextParam.done) {
    searchParamValues.push({ type: nextParam.value[0], value: nextParam.value[1] });
    nextParam = searchParamsIterator.next();
  }

  const deleteParam = (deleteType: SearchType, deleteValue: string) => {
    const newSearchParams = new URLSearchParams();
    const searchParamsIterator = searchParams.entries();
    let nextParam = searchParamsIterator.next();
    while (!nextParam.done) {
      console.log(nextParam);
      if (!(nextParam.value[1] === deleteValue && nextParam.value[0] === deleteType)) {
        newSearchParams.append(nextParam.value[0], nextParam.value[1]);
      }
      nextParam = searchParamsIterator.next();
    }
    history.push(asSearchPath(newSearchParams), {
      showBack: true,
    });
  };

  return (
    <div className='search-breadcrumbs'>
      {searchParamValues.map((el, idx) => {
        return (
          <Chip
            key={idx}
            label={el.value}
            onDelete={event => deleteParam(el.type as SearchType, el.value)}
          />
        );
      })}
    </div>
  );
};
export default SearchBreadcrumbs;
