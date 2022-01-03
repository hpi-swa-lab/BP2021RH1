import React, { useEffect } from 'react';
import { History } from 'history';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { asApiPath } from '../../../App';
import Loading from '../../../components/Loading';
import {
  Exact,
  GetKeywordTagSuggestionsQuery,
  InputMaybe,
  useGetDecadePreviewThumbnailsQuery,
  useGetKeywordTagSuggestionsLazyQuery,
} from '../../../graphql/APIConnector';
import ItemList from '../common/ItemList';
import QueryErrorDisplay from '../../../components/QueryErrorDisplay';
import { LazyQueryResult } from '@apollo/client';

const KeywordTagsSearchList = ({
  keywordTagsResponse,
}: {
  keywordTagsResponse: LazyQueryResult<
    GetKeywordTagSuggestionsQuery,
    Exact<{
      name?: InputMaybe<string> | undefined;
    }>
  >;
}) => {
  const history: History = useHistory();
  const { t } = useTranslation();

  if (keywordTagsResponse.error) {
    return <QueryErrorDisplay error={keywordTagsResponse.error} />;
  } else if (keywordTagsResponse.loading) {
    return <Loading />;
  } else if (keywordTagsResponse.data?.keywordTags?.length) {
    return (
      <ItemList
        compact={true}
        items={keywordTagsResponse.data.keywordTags.map(tag => ({
          name: tag?.name ?? '',
          background: tag?.thumbnail?.length
            ? asApiPath(String(tag.thumbnail[0]?.media?.formats?.small?.url || ''))
            : '',
          onClick: () => {
            history.push(`/search/${encodeURIComponent(tag?.name ?? '')}`, { showBack: true });
          },
        }))}
      />
    );
  } else {
    return <div>{t('common.no-keywords')}</div>;
  }
};

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
            background: asApiPath(thumbnail),
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
        <KeywordTagsSearchList keywordTagsResponse={keywordTagsResponse} />
      </div>

      <div className='search-section'>
        <h3>{t('common.decades').toUpperCase()}</h3>
        {decadesList}
      </div>
    </div>
  );
};

export default SearchHub;
