import React from 'react';
import { Chip } from '@mui/material';
import { useHistory } from 'react-router-dom';
import { History } from 'history';
import { asSearchPath } from './SearchView';
import './SearchBreadcrumbs.scss';
import EventIcon from '@mui/icons-material/Event';
import SellIcon from '@mui/icons-material/Sell';
import DescriptionIcon from '@mui/icons-material/Description';
import SearchIcon from '@mui/icons-material/Search';
import PersonIcon from '@mui/icons-material/Person';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import FolderIcon from '@mui/icons-material/Folder';
import FolderSpecialIcon from '@mui/icons-material/FolderSpecial';
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
        return <EventIcon />;
      case SearchType.KEYWORD:
        return <SellIcon />;
      case SearchType.DESCRIPTION:
        return <DescriptionIcon />;
      case SearchType.LOCATION:
        return <LocationOnIcon />;
      case SearchType.PERSON:
        return <PersonIcon />;
      case SearchType.ALL:
        return <SearchIcon />;
      case SearchType.COLLECTION:
        return <FolderIcon />;
      case SearchType.ARCHIVE:
        return <FolderSpecialIcon />;
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
