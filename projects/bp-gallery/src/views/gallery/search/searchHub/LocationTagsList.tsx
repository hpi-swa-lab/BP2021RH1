import React from 'react';
import { useHistory } from 'react-router-dom';
import { History } from 'history';
import { useTranslation } from 'react-i18next';
import { useGetAllLocationTagsQuery } from '../../../../graphql/APIConnector';
import { useSimplifiedQueryResponseData } from '../../../../graphql/queryUtils';
import ItemList from '../../shared/ItemList';
import { asApiPath } from '../../../../App';
import QueryErrorDisplay from '../../../shared/QueryErrorDisplay';
import Loading from '../../../shared/Loading';
import { FlatLocationTagPreview } from '../../../../types/additionalFlatTypes';
import { addNewParamToSearchPath, SearchType } from '../SearchView';

const LocationTagsList = () => {
  const history: History = useHistory();
  const { t } = useTranslation();

  const { data, loading, error } = useGetAllLocationTagsQuery();

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
              addNewParamToSearchPath(SearchType.LOCATION, encodeURIComponent(String(tag.name)))
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
    return <div>{t('something-went-wrong')}</div>;
  }
};

export default LocationTagsList;
