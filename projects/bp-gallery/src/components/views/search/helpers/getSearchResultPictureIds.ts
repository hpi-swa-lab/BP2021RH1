import { MeiliSearch } from 'meilisearch';

const getSearchResultPictureIds = async (searchparams: {
  searchTerms: string[];
  searchTimes: string[][];
}) => {
  const client = new MeiliSearch({
    host: 'localhost:7700',
    apiKey: '',
  });

  const index = client.index('picture');

  const searchResult = await index.search(searchparams.searchTerms[0]);
  const SearchResultPictureIds = searchResult.hits.map(hit => hit.id);

  return SearchResultPictureIds;
};

export default getSearchResultPictureIds;
