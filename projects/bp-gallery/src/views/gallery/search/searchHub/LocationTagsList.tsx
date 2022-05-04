import React from 'react';
import { useHistory } from 'react-router-dom';
import { History } from 'history';
import { useTranslation } from 'react-i18next';
import { useGetLocationTagsQuery } from '../../../../graphql/APIConnector';
import { useSimplifiedQueryResponseData } from '../../../../graphql/queryUtils';
import { FlatLocationTagPreview } from '../../../../graphql/additionalFlatTypes';
import QueryErrorDisplay from '../../../../components/QueryErrorDisplay';
import Loading from '../../../../components/Loading';
import ItemList from '../../common/ItemList';
import { asApiPath } from '../../../../App';
import { addNewParamToSearchPath, SearchType } from '../SearchView';

const LocationTagsList = () => {
  const history: History = useHistory();
  const { t } = useTranslation();

  const { data, loading, error } = useGetLocationTagsQuery();

  const locationTags: FlatLocationTagPreview[] | undefined =
    useSimplifiedQueryResponseData(data)?.locationTags;

  if (error) {
    return <QueryErrorDisplay error={error} />;
  } else if (loading) {
    return <Loading />;
  } else if (locationTags?.length) {
    return (
      <ItemList
        compact={true}
        items={locationTags.map(tag => ({
          name: tag.name,
          background: asApiPath(String(tag.thumbnail[0]?.media?.formats?.small?.url || '')),
          onClick: () => {
            history.push(
              addNewParamToSearchPath(SearchType.ALL, encodeURIComponent(String(tag.name)))
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

export default LocationTagsList;
