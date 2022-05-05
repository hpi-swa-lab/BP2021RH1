import React from 'react';
import { useHistory } from 'react-router-dom';
import { History } from 'history';
import { useTranslation } from 'react-i18next';
import { useGetLocationTagsQuery } from '../../../../graphql/APIConnector';
import { useSimplifiedQueryResponseData } from '../../../../graphql/queryUtils';
import ItemList from '../../shared/ItemList';
import { asApiPath } from '../../../../App';
import { addNewParamToSearchPath, SearchType } from '../SearchView';
import Loading from '../../../shared/Loading';
import QueryErrorDisplay from '../../../shared/QueryErrorDisplay';
import { FlatLocationTagPreview } from '../../../../types/additionalFlatTypes';

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
