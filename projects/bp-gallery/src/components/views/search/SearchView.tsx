import { Location } from 'history';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import useBulkOperations from '../../../hooks/bulk-operations.hook';
import { HelpTooltip } from '../../common/HelpTooltip';
import PictureScrollGrid from '../../common/picture-gallery/PictureScrollGrid';
import { ShowStats } from '../../provider/ShowStatsProvider';
import NoSearchResultsText from './NoSearchResultsText';
import SearchBar from './SearchBar';
import SearchBreadcrumbs from './SearchBreadcrumbs';
import SearchHub from './SearchHub';
import './SearchView.scss';
import { isValidYear } from './helpers/addNewParamToSearchPath';
import getSearchResultPictureIds from './helpers/getSearchResultPictureIds';
import { SearchType, paramToTime } from './helpers/search-filters';
import { toURLSearchParam } from './helpers/url-search-params';

const isValidTimeSpecification = (searchRequest: string) => {
  // Specification of year range e.g. '1970-1979'
  if (searchRequest.includes('-')) {
    // Trimming each year part makes it tolerant to multiple spaces between the '-'
    const yearParts = searchRequest.split('-').map(yearPart => yearPart.trim());
    return isValidYear(yearParts[0]) && isValidYear(yearParts[1]);
  }

  // Simple year specification e.g. '1972'
  return isValidYear(searchRequest);
};

const SearchView = () => {
  const [areResultsEmpty, setAreResultsEmpty] = useState<boolean>(false);
  const { search }: Location = useLocation();
  const { t } = useTranslation();

  const searchParams = useMemo(() => {
    return new URLSearchParams(search);
  }, [search]);

  const isAllSearchActive = useMemo(
    () => searchParams.has(toURLSearchParam(SearchType.ALL)),
    [searchParams]
  );

  // Builds query from search params in the path
  const queryParams = useMemo(() => {
    // if (isAllSearchActive) {
    const allSearchTerms = searchParams
      .getAll(toURLSearchParam(SearchType.ALL))
      .map(decodeURIComponent);
    const searchTimes: string[][] = [];
    allSearchTerms.forEach(searchTerm => {
      if (isValidTimeSpecification(searchTerm)) {
        const { startTime, endTime } = paramToTime(searchTerm);
        searchTimes.push([searchTerm, startTime, endTime]);
      }
    });
    return {
      searchTerms: allSearchTerms.filter(searchTerm => !isValidTimeSpecification(searchTerm)),
      searchTimes,
    };
    // }
    // return convertSearchParamsToPictureFilters(searchParams);
  }, [/*isAllSearchActive,*/ searchParams]);
  console.log(getSearchResultPictureIds(queryParams));
  const { linkToCollection, bulkEdit } = useBulkOperations();

  return (
    <div className='search-content'>
      <div className='search-bar-container'>
        {' '}
        {(!areResultsEmpty || !search) && (
          <SearchBar searchParams={searchParams} isAllSearchActive={isAllSearchActive} />
        )}
        <HelpTooltip title={t('search.question')} content={t('search.help')} />
        <div className='breadcrumb'>
          <SearchBreadcrumbs searchParams={searchParams} />
        </div>
      </div>
      {areResultsEmpty && search && <NoSearchResultsText searchParams={searchParams} />}
      {!search ? (
        <SearchHub />
      ) : (
        <ShowStats>
          <PictureScrollGrid
            queryParams={queryParams}
            isAllSearchActive={isAllSearchActive}
            hashbase={search}
            bulkOperations={[linkToCollection, bulkEdit]}
            resultPictureCallback={(pictures: number) => {
              setAreResultsEmpty(pictures <= 0);
            }}
          />
        </ShowStats>
      )}
    </div>
  );
};

export default SearchView;
