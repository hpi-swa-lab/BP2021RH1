import { Chip } from '@mui/material';
import { useHistory } from 'react-router-dom';
import { History } from 'history';
import './SearchBreadcrumbs.scss';
import {
  Sell,
  Event,
  Description,
  Search,
  Person,
  LocationOn,
  Folder,
  FolderSpecial,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { getDecadeTranslation } from './helpers/search-translation';
import { SearchType } from './helpers/search-filters';
import { asSearchPath } from './helpers/addNewParamToSearchPath';

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

  for (const [type, value] of Array.from(searchParams.entries())) {
    searchParamValues.push({
      type,
      value: decodeURIComponent(value),
    });
  }

  const deleteParam = (deleteType: string, deleteValue: string) => {
    const newSearchParams = new URLSearchParams();
    for (const [type, value] of Array.from(searchParams.entries())) {
      if (!(decodeURIComponent(value) === deleteValue && type === deleteType)) {
        newSearchParams.append(type, value);
      }
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
