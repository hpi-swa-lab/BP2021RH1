import { MeiliSearch } from 'meilisearch';

const getSearchResultPictureIds = async (
  searchparams: {
    searchTerms: string[];
    searchTimes: string[][];
  },
  filter: string
) => {
  const client = new MeiliSearch({
    host: 'localhost:7700',
    apiKey: '',
  });
  const index = client.index('picture');

  filter = typeof filter === 'undefined' ? '' : filter;

  const searchTerms = searchparams.searchTerms;
  const searchTimes = searchparams.searchTimes;

  const TIME_RANGE_START = 'time_range_tag_start';
  const TIME_RANGE_END = 'time_range_tag_end';

  if (searchTimes && searchTimes.length !== 0) {
    let timeFilters = [];
    for (let i = 0; i++; i < searchTimes.length) {
      timeFilters[
        i
      ] = `(${searchTimes[i][1]} <= ${TIME_RANGE_START} AND ${TIME_RANGE_END} <= ${searchTimes[i][2]})`;
    }
    const timeFilter = timeFilters.join(' AND ');
    filter.concat(' AND ', timeFilter);
  }

  const RESULT_LIMIT = 1000;

  const settings = { limit: RESULT_LIMIT, showMatchesPosition: true, filter: filter };

  if (searchTerms && searchTerms.length !== 0) {
    let searchTermResults = <any>[];
    for (let i = 0; i < searchTerms.length; i++) {
      searchTermResults[i] = await index
        .search(searchparams.searchTerms[i], settings)
        .then(value => value.hits.map(hit => hit.id).flat());
    }
    let resultIntersection = searchTermResults[0];
    for (let i = 1; i < searchTermResults.length; i++) {
      resultIntersection = resultIntersection.filter((value: any) =>
        searchTermResults[i].includes(value)
      );
    }
    return resultIntersection;
  } else if (!searchTerms || searchTerms.length === 0) {
    const searchResultForEmptySearch = await index
      .search('', settings)
      .then(value => value.hits.map(hit => hit.id).flat());
    return searchResultForEmptySearch;
  }
};

export default getSearchResultPictureIds;
