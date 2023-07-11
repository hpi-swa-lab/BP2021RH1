import { Location } from 'history';
import { sortBy } from 'lodash';
import { useCallback, useContext, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import usePromise from 'react-use-promise';
import { PictureFiltersInput } from '../../../graphql/APIConnector';
import { useFlag } from '../../../helpers/growthbook';
import useBulkOperations from '../../../hooks/bulk-operations.hook';
import { FlatPicture } from '../../../types/additionalFlatTypes';
import PictureScrollGrid from '../../common/picture-gallery/PictureScrollGrid';
import { ExhibitionIdContext } from '../../provider/ExhibitionProvider';
import { ShowStats } from '../../provider/ShowStatsProvider';
import AdvancedSearch from './AdvancedSearch';
import NoSearchResultsText from './NoSearchResultsText';
import './SearchView.scss';
import { isValidYear } from './helpers/addNewParamToSearchPath';
import getSearchResultHits from './helpers/getSearchResultHits';
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
  const [filter, setFilter] = useState('');
  const [searchIndex, setSearchIndex] = useState('picture');
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
      (await getSearchResultHits(queryParams, filter, searchIndex)).map(hit =>
        (hit.id as number).toString()
      ),
    [queryParams, filter]
  );
  console.log(searchResultIds);

  const pictureFilter: PictureFiltersInput = useMemo(() => {
    if (error) {
      console.log(error);
      return {};
    }
    return state === 'resolved' ? { id: { in: searchResultIds } } : {};
  }, [searchResultIds, state, error]);

  const customSort = useCallback(
    (pictures: FlatPicture[]) => sortBy(pictures, picture => searchResultIds?.indexOf(picture.id)),
    [searchResultIds]
  );

  const isOldSearchActive = useFlag('old_search');

  const { linkToCollection, createSequence, bulkEdit, addToExhibition } = useBulkOperations();

  const exhibitionId = useContext(ExhibitionIdContext);

  return (
    <div className='search-content'>
      <AdvancedSearch
        setFilter={setFilter}
        searchIndex={searchIndex}
        setSearchIndex={setSearchIndex}
        searchParams={searchParams}
        isAllSearchActive={isAllSearchActive}
      ></AdvancedSearch>
      {areResultsEmpty && search && <NoSearchResultsText searchParams={searchParams} />}

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
          customSort={customSort}
          hashbase={search}
          bulkOperations={[
            linkToCollection,
            createSequence,
            bulkEdit,
            ...(exhibitionId ? [addToExhibition] : []),
          ]}
          resultPictureCallback={(pictures: number) => {
            setAreResultsEmpty(pictures <= 0);
          }}
          textFilter={null}
        />
      </ShowStats>
    </div>
  );
};

export default SearchView;
