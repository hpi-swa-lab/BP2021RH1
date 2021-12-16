import React, { useEffect } from 'react';
import { History } from 'history';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { apiBase } from '../../../App';
import Loading from '../../../components/Loading';
import {
  useGetDecadePreviewThumbnailsQuery,
  useGetKeywordTagSuggestionsLazyQuery,
} from '../../../graphql/APIConnector';
import ItemList from '../common/ItemList';

const SearchHub = ({ searchSnippet }: { searchSnippet?: string }) => {
  const history: History = useHistory();
  const { t } = useTranslation();

  const decadeThumbnails = useGetDecadePreviewThumbnailsQuery();

  const decadesList = (
    <ItemList
      compact={true}
      items={Array(7)
        .fill(0)
        .map((_, index) => {
          const thumbnailData = decadeThumbnails.data
            ? (decadeThumbnails.data as any)[`s${(index + 3) * 10}`]
            : null;
          const thumbnail: string = thumbnailData
            ? thumbnailData[0]?.media?.formats?.small?.url ?? ''
            : '';
          return {
            name: `${(index + 3) * 10}er`,
            background: `${apiBase}${thumbnail}`,
            onClick: () => {
              history.push(`/search/?decade=${(index + 3) * 10}s`, { showBack: true });
            },
          };
        })}
    />
  );
  const [getKeywordTagSuggestions, keywordTagsResponse] = useGetKeywordTagSuggestionsLazyQuery({
    variables: {
      name: '',
    },
  });

  useEffect(() => {
    getKeywordTagSuggestions({
      variables: {
        name: searchSnippet ?? '',
      },
    });
  }, [getKeywordTagSuggestions, searchSnippet]);

  return (
    <div className='search-hub'>
      <div className='search-section'>
        <h3>{t('common.suggestions').toUpperCase()}</h3>
        {keywordTagsResponse.data?.keywordTags ? (
          <ItemList
            compact={true}
            items={keywordTagsResponse.data.keywordTags.map(tag => ({
              name: tag?.name ?? '',
              background: tag?.thumbnail?.length
                ? `${apiBase}/${String(tag.thumbnail[0]?.media?.formats?.small?.url || '')}`
                : '',
              onClick: () => {
                history.push(`/search/${encodeURIComponent(tag?.name ?? '')}`, { showBack: true });
              },
            }))}
          />
        ) : (
          <Loading />
        )}
      </div>

      <div className='search-section'>
        <h3>{t('common.decades').toUpperCase()}</h3>
        {decadesList}
      </div>
    </div>
  );
};

export default SearchHub;
