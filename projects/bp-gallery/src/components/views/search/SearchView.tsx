import { Location } from 'history';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import usePromise from 'react-use-promise';
import { PictureFiltersInput } from '../../../graphql/APIConnector';
import { useFlag } from '../../../helpers/growthbook';
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
  }, [searchParams]);

  const [searchResultIds, error, state] = usePromise(
    async () =>
      (await getSearchResultPictureIds(queryParams, '')).map(hit => (hit.id as number).toString()),
    [queryParams]
  );

  const pictureFilter: PictureFiltersInput = useMemo(() => {
    if (error) {
      console.log(error);
      return {};
    }
    return state === 'resolved' ? { id: { in: searchResultIds } } : {};
  }, [searchResultIds, state, error]);
  console.log(pictureFilter);
  const isOldSearchActive = useFlag('old_search');

  if (import.meta.env.MODE === 'development') {
    // getSearchResultPictureIds(queryParams, '').then(res => console.log('search results:', res));
    console.log('resultids', searchResultIds);
    console.log(
      '31149 key:',
      searchResultIds?.findIndex(element => element === '31149')
    );
  }
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
            queryParams={isOldSearchActive ? queryParams : pictureFilter}
            // if allSearch is active the custom resolver for allSearch will be used, which can only
            // handle simple queryparams in the format {searchTerms:string[], searchTimes:string[][]} which
            //  leads to erros when we use queryparams of the type PictureFiltersInput,
            // so isAllSearchactive has to be false if we want to use the Meilisearch results
            // by ANDing the isAllsearchActive flag with the isOldsearchActive flag we can make sure
            // the isAllSearchActive property will always be false if we want to use Meilisearch
            isAllSearchActive={isOldSearchActive && isAllSearchActive}
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
