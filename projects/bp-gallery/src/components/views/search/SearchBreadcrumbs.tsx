import {
  Description,
  Event,
  Folder,
  FolderSpecial,
  LocationOn,
  Person,
  Search,
  Sell,
} from '@mui/icons-material';
import { Chip } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useVisit } from './../../../helpers/history';
import { asSearchPath } from './helpers/addNewParamToSearchPath';
import { SearchType } from './helpers/search-filters';
import { getDecadeTranslation } from './helpers/search-translation';
import { fromURLSearchParam } from './helpers/url-search-params';
import './SearchBreadcrumbs.scss';

type SearchParam = { type: string; value: string };
type SearchParams = SearchParam[];

const SearchBreadcrumbs = ({ searchParams }: { searchParams: URLSearchParams }) => {
  const { visit } = useVisit();
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
      type: fromURLSearchParam(type),
      value: decodeURIComponent(value),
    });
  }

  const deleteParam = (deleteType: string, deleteValue: string) => {
    const newSearchParams = new URLSearchParams();
    for (const [type, value] of Array.from(searchParams.entries())) {
      if (!(decodeURIComponent(value) === deleteValue && fromURLSearchParam(type) === deleteType)) {
        newSearchParams.append(type, value);
      }
    }
    visit(asSearchPath(newSearchParams));
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
