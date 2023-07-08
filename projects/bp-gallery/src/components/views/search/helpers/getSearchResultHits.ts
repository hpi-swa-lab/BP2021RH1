import { MeiliSearch } from 'meilisearch';

const dateToTimeStamp = (date: string) => {
  return Date.parse(date) / 1000;
};

const getSearchResultHits = async (
  { searchTerms, searchTimes }: { searchTerms: string[]; searchTimes: string[][] },
  filter: string,
  searchIndex: string
) => {
  const client = new MeiliSearch({
    host: 'localhost:7700',
    apiKey: '',
  });
  const index = client.index(searchIndex);

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
    const timeFilter = timeFilters.join(' OR ');
    filter = filter === '' ? timeFilter : filter.concat(' AND ', timeFilter);
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
