import React from 'react';
import { Chip } from 'mui';
import { useHistory } from 'react-router-dom';
import { History } from 'history';
import { asSearchPath } from './SearchView';
import './SearchBreadcrumbs.scss';
import { Sell, Event, Description, Search, Person, LocationOn, Folder, FolderSpecial } from 'mui';
import { useTranslation } from 'react-i18next';
import { getDecadeTranslation } from './helpers/search-translation';
import { SearchType } from './helpers/search-filters';

type SearchParam = { type: string; value: string };
type SearchParams = SearchParam[];

const SearchBreadcrumbs = ({ searchParams }: { searchParams: URLSearchParams }) => {
  const history: History = useHistory();
  const { t } = useTranslation();
  const searchParamValues: SearchParams = [];

  const iconForType = (searchType: string) => {
    switch (searchType) {
      case SearchType.DECADE:
      case SearchType.TIME_RANGE:
        return <Event />;
      case SearchType.KEYWORD:
        return <Sell />;
      case SearchType.DESCRIPTION:
        return <Description />;
      case SearchType.LOCATION:
        return <LocationOn />;
      case SearchType.PERSON:
        return <Person />;
      case SearchType.ALL:
        return <Search />;
      case SearchType.COLLECTION:
        return <Folder />;
      case SearchType.ARCHIVE:
        return <FolderSpecial />;
      default:
        return <></>;
    }
  };

  const searchParamsIterator = searchParams.entries();
  let nextParam = searchParamsIterator.next();
  while (!nextParam.done) {
    searchParamValues.push({
      type: nextParam.value[0],
      value: decodeURIComponent(nextParam.value[1]),
    });
    nextParam = searchParamsIterator.next();
  }

  const deleteParam = (deleteType: string, deleteValue: string) => {
    const newSearchParams = new URLSearchParams();
    const searchParamsIterator = searchParams.entries();
    let nextParam = searchParamsIterator.next();
    while (!nextParam.done) {
      if (
        !(
          decodeURIComponent(nextParam.value[1]) === deleteValue &&
          nextParam.value[0] === deleteType
        )
      ) {
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
            className='breadcrumb-chip'
            key={idx}
            icon={iconForType(el.type)}
            label={el.type === SearchType.DECADE ? getDecadeTranslation(t, el.value) : el.value}
            search-type={el.type}
            onDelete={() => deleteParam(el.type, el.value)}
          />
        );
      })}
    </div>
  );
};
export default SearchBreadcrumbs;
