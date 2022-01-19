import { useGetKeywordTagSuggestionsLazyQuery } from '../../../../graphql/APIConnector';
import { History } from 'history';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import QueryErrorDisplay from '../../../../components/QueryErrorDisplay';
import Loading from '../../../../components/Loading';
import ItemList from '../../common/ItemList';
import { asApiPath } from '../../../../App';
import React, { useEffect } from 'react';
import { asSearchPath, SearchType } from '../SearchView';

const KeywordTagsSearchList = ({ searchSnippet }: { searchSnippet: string }) => {
  const history: History = useHistory();
  const { t } = useTranslation();

  const [getKeywordTagSuggestions, keywordTagsResponse] = useGetKeywordTagSuggestionsLazyQuery({
    variables: {
      name: '',
    },
  });

  useEffect(() => {
    getKeywordTagSuggestions({
      variables: {
        name: searchSnippet,
      },
    });
  }, [getKeywordTagSuggestions, searchSnippet]);

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
            history.push(asSearchPath(SearchType.KEYWORD, encodeURIComponent(tag?.name ?? '')), {
              showBack: true,
            });
          },
        }))}
      />
    );
  } else {
    return <div>{t('common.no-keywords')}</div>;
  }
};

export default KeywordTagsSearchList;
