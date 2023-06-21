import { MeiliSearch } from 'meilisearch';

const dateToTimeStamp = (date: string) => {
  return Date.parse(date) / 1000;
};

const getSearchResultPictureIds = async (
  { searchTerms, searchTimes }: { searchTerms: string[]; searchTimes: string[][] },
  filter: string
) => {
  const client = new MeiliSearch({
    host: 'localhost:7700',
    apiKey: '',
  });
  const index = client.index('picture');

  const TIME_RANGE_START = 'time_range_tag_start';
  const TIME_RANGE_END = 'time_range_tag_end';
  // when building a filter for meilisearch the filtered attribute always
  //  has to come first i.e. time_range_start >= 0 works but 0 <= time_range_start does not work
  if (searchTimes.length !== 0) {
    const timeFilters = searchTimes.map(
      searchTime =>
        `(${TIME_RANGE_START} >= ${dateToTimeStamp(
          searchTime[1]
        )} AND ${TIME_RANGE_END} <= ${dateToTimeStamp(searchTime[2])})`
    );

    const timeFilter = timeFilters.join(' OR ');
    filter = filter === '' ? timeFilter : filter.concat(' AND ', timeFilter);
  }

  const RESULT_LIMIT = 1000;
  // this makes it so only documents that match all of the query terms are returned
  const MATCHING_STRATEGY = 'all';

  const settings = {
    limit: RESULT_LIMIT,
    showMatchesPosition: true,
    matchingStrategy: MATCHING_STRATEGY,
    filter: filter,
  };
  const query = searchTerms.length !== 0 ? searchTerms.join(' ') : '';
  const searchResult = await index.search(query, settings);
  return searchResult.hits;
};

export default getSearchResultPictureIds;
