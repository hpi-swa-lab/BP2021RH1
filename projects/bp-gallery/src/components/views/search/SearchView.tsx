import { Location } from 'history';
import { useContext, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import usePromise from 'react-use-promise';
import { useFlag } from '../../../helpers/growthbook';
import useBulkOperations from '../../../hooks/bulk-operations.hook';
import { TextFilter } from '../../../hooks/get-pictures.hook';
import PictureScrollGrid from '../../common/picture-gallery/PictureScrollGrid';
import { TextFilterSelect } from '../../common/picture-gallery/TextFilterSelect';
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

  const [textFilter, setTextFilter] = useState(TextFilter.ONLY_PICTURES);

  const [searchResultIds] = usePromise(
    async () =>
      (await getSearchResultHits(queryParams, filter, textFilter, searchIndex)).map(hit =>
        (hit.id as number).toString()
      ),
    [queryParams, textFilter, filter]
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
      <div className='flex flex-row justify-end mt-4'>
        <TextFilterSelect value={textFilter} onChange={setTextFilter} />
      </div>

      <ShowStats>
        <PictureScrollGrid
          queryParams={isOldSearchActive ? queryParams : searchResultIds ?? []}
          // if allSearch is active the custom resolver for allSearch will be used, which can only
          // handle simple queryparams in the format {searchTerms:string[], searchTimes:string[][]} which
          //  leads to erros when we use queryparams of the type PictureFiltersInput,
          // so isAllSearchactive has to be false if we want to use the Meilisearch results
          // by ANDing the isAllsearchActive flag with the isOldsearchActive flag we can make sure
          // the isAllSearchActive property will always be false if we want to use Meilisearch
          isAllSearchActive={isOldSearchActive && isAllSearchActive}
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
          textFilter={TextFilter.PICTURES_AND_TEXTS} // text filtering is handled by meilisearch filters
        />
      </ShowStats>
    </div>
  );
};

export default SearchView;
