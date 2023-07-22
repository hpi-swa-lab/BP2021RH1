import { MeiliSearch } from 'meilisearch';
import { TextFilter } from '../../../../hooks/get-pictures.hook';

const dateToTimeStamp = (date: string) => {
  return Date.parse(date) / 1000;
};

const getSearchResultHits = async (
  { searchTerms, searchTimes }: { searchTerms: string[]; searchTimes: string[][] },
  filter: string,
  textFilter: TextFilter,
  searchIndex: string
) => {
  const SEARCH_API_HOST = import.meta.env.VITE_MEILISEARCH_HOST;
  const SEARCH_API_KEY = import.meta.env.VITE_MEILISEARCH_API_KEY;

  const client = new MeiliSearch({
    host: SEARCH_API_HOST,
    apiKey: SEARCH_API_KEY,
  });
  const index = client.index(searchIndex);

  const addFilter = (part: string) => {
    filter += (filter === '' ? '' : ' AND ') + part;
  };

  const TIME_RANGE_START = 'time_range_tag_start';
  const TIME_RANGE_END = 'time_range_tag_end';
  const DATE = 'date';
  // when building a filter for meilisearch the filtered attribute always
  //  has to come first i.e. time_range_start >= 0 works but 0 <= time_range_start does not work
  if (searchTimes.length !== 0 && (searchIndex === 'picture' || searchIndex === 'comment')) {
    const timeFilters = searchTimes.map(
      searchTime =>
        `(${searchIndex === 'picture' ? TIME_RANGE_START : DATE} >= ${dateToTimeStamp(
          searchTime[1]
        )} AND ${searchIndex === 'picture' ? TIME_RANGE_END : DATE} <= ${dateToTimeStamp(
          searchTime[2]
        )})`
    );
    addFilter(timeFilters.join(' OR '));
  }

  if (searchIndex === 'picture') {
    switch (textFilter) {
      case TextFilter.ONLY_PICTURES:
        addFilter('(is_text = false OR is_text IS NULL)');
        break;
      case TextFilter.ONLY_TEXTS:
        addFilter('is_text = true');
        break;
      case TextFilter.PICTURES_AND_TEXTS:
      default:
        // nothing
        break;
    }
  }
  // for reference: https://www.meilisearch.com/docs/reference/api/search
  const RESULT_LIMIT = 1000;
  const MATCHING_STRATEGY = 'all';

  const settings = {
    limit: RESULT_LIMIT,
    matchingStrategy: MATCHING_STRATEGY,
    filter: filter,
  };
  const query = searchTerms.length !== 0 ? searchTerms.join(' ') : '';
  const searchResult = await index.search(query, settings);
  return searchResult.hits;
};

export default getSearchResultHits;
