import React, { useEffect } from 'react';
import { History } from 'history';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useGetKeywordTagSuggestionsLazyQuery } from '../../../../graphql/APIConnector';
import { useSimplifiedQueryResponseData } from '../../../../graphql/queryUtils';
import { FlatKeywordTagSuggestion } from '../../../../types/additionalFlatTypes';
import QueryErrorDisplay from '../../../shared/QueryErrorDisplay';
import Loading from '../../../shared/Loading';
import ItemList from '../../shared/ItemList';
import { asApiPath } from '../../../../App';
import { addNewParamToSearchPath, SearchType } from '../SearchView';

const KeywordTagsSearchList = ({ searchSnippet }: { searchSnippet: string }) => {
  const history: History = useHistory();
  const { t } = useTranslation();

  const DEFAULT_THUMBNAIL_URL = '/bad-harzburg-stiftung-logo.png';

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
            ? asApiPath(
                String(tag.thumbnail[0].media?.formats?.small?.url || DEFAULT_THUMBNAIL_URL)
              )
            : DEFAULT_THUMBNAIL_URL,
          onClick: () => {
            history.push(
              addNewParamToSearchPath(SearchType.KEYWORD, encodeURIComponent(String(tag.name)))
                .searchVal,
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
