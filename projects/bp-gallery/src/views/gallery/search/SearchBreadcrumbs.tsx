import React from 'react';
import { Chip } from '@mui/material';
import { useHistory } from 'react-router-dom';
import { History } from 'history';
import { asSearchPath, SearchType } from './SearchView';
import './SearchBreadcrumbs.scss';
import EventIcon from '@mui/icons-material/Event';
import SellIcon from '@mui/icons-material/Sell';
import DescriptionIcon from '@mui/icons-material/Description';
import SearchIcon from '@mui/icons-material/Search';

type SearchParam = { type: string; value: string };
type SearchParams = SearchParam[];

const SearchBreadcrumbs = ({ searchParams }: { searchParams: URLSearchParams }) => {
  const history: History = useHistory();
  const searchParamValues: SearchParams = [];
  const iconsToTypes = (searchType: SearchType) => {
    switch (searchType) {
      case SearchType.DECADE:
        return <EventIcon />;
      case SearchType.KEYWORD:
        return <SellIcon />;
      case SearchType.DESCRIPTION:
        return <DescriptionIcon />;
      case SearchType.ALL:
        return <SearchIcon />;
      default:
        return <></>;
    }
  };

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
            className='breadcrumb-chip'
            key={idx}
            icon={iconsToTypes(el.type as SearchType)}
            label={el.value}
            search-type={el.type}
            onDelete={() => deleteParam(el.type as SearchType, el.value)}
          />
        );
      })}
    </div>
  );
};
export default SearchBreadcrumbs;
