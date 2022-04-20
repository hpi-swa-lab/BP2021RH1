import React, { useEffect } from 'react';
import { History } from 'history';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useGetKeywordTagSuggestionsLazyQuery } from '../../../../graphql/APIConnector';
import { useSimplifiedQueryResponseData } from '../../../../graphql/queryUtils';
import { FlatKeywordTagSuggestion } from '../../../../graphql/additionalFlatTypes';
import QueryErrorDisplay from '../../../../components/QueryErrorDisplay';
import Loading from '../../../../components/Loading';
import ItemList from '../../common/ItemList';
import { asApiPath } from '../../../../App';
import { addNewParamToSearchPath, SearchType } from '../SearchView';

const KeywordTagsSearchList = ({ searchSnippet }: { searchSnippet: string }) => {
  const history: History = useHistory();
  const { t } = useTranslation();

  const [getKeywordTagSuggestions, { data, loading, error, fetchMore }] =
    useGetKeywordTagSuggestionsLazyQuery({
      variables: {
        name: '',
        start: 0,
      },
    });

  const keywordTags: FlatKeywordTagSuggestion[] | undefined =
    useSimplifiedQueryResponseData(data)?.keywordTags;

  useEffect(() => {
    getKeywordTagSuggestions({
      variables: {
        name: searchSnippet,
        start: 0,
        limit: 30,
      },
    });
  }, [getKeywordTagSuggestions, searchSnippet]);

  const reloadOnScroll = (count: number) => {
    if (fetchMore) {
      fetchMore({
        variables: {
          name: searchSnippet,
          start: keywordTags?.length,
          limit: count,
        },
      });
    }
  };

  if (error) {
    return <QueryErrorDisplay error={error} />;
  } else if (loading) {
    return <Loading />;
  } else if (keywordTags?.length) {
    return (
      <ItemList
        compact={true}
        reloadOnScroll={reloadOnScroll}
        items={keywordTags.map(tag => ({
          name: tag.name,
          background: tag.thumbnail.length
            ? asApiPath(String(tag.thumbnail[0].media?.formats?.small?.url || ''))
            : '',
          onClick: () => {
            history.push(
              addNewParamToSearchPath(SearchType.KEYWORD, encodeURIComponent(String(tag.name))),
              {
                showBack: true,
              }
            );
          },
        }))}
      />
    );
  } else {
    return <div>{t('common.no-keywords')}</div>;
  }
};

export default KeywordTagsSearchList;
