import React, { useEffect } from 'react';
import { History } from 'history';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useGetKeywordTagSuggestionsLazyQuery } from '../../../../graphql/APIConnector';
import { useFlatQueryResponseData } from '../../../../graphql/queryUtils';
import { FlatKeywordTagSuggestion } from '../../../../graphql/additionalFlatTypes';
import QueryErrorDisplay from '../../../../components/QueryErrorDisplay';
import Loading from '../../../../components/Loading';
import ItemList from '../../common/ItemList';
import { asApiPath } from '../../../../App';
import { asSearchPath, SearchType } from '../SearchView';

const KeywordTagsSearchList = ({ searchSnippet }: { searchSnippet: string }) => {
  const history: History = useHistory();
  const { t } = useTranslation();

  const [getKeywordTagSuggestions, { data, loading, error }] = useGetKeywordTagSuggestionsLazyQuery(
    {
      variables: {
        name: '',
      },
    }
  );

  useEffect(() => {
    getKeywordTagSuggestions({
      variables: {
        name: searchSnippet,
      },
    });
  }, [getKeywordTagSuggestions, searchSnippet]);

  const keywordTags: FlatKeywordTagSuggestion[] | undefined =
    useFlatQueryResponseData(data)?.keywordTags;

  if (error) {
    return <QueryErrorDisplay error={error} />;
  } else if (loading) {
    return <Loading />;
  } else if (keywordTags?.length) {
    return (
      <ItemList
        compact={true}
        items={keywordTags.map(tag => ({
          name: tag.name,
          background: tag.thumbnail.length
            ? asApiPath(String(tag.thumbnail[0].media?.formats?.small?.url || ''))
            : '',
          onClick: () => {
            history.push(asSearchPath(SearchType.KEYWORD, encodeURIComponent(String(tag.name))), {
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
