import React from 'react';
import { useTranslation } from 'react-i18next';
import { History } from 'history';
import { useHistory } from 'react-router-dom';
import QueryErrorDisplay from '../../../../components/QueryErrorDisplay';
import Loading from '../../../../components/Loading';
import ItemList from '../../common/ItemList';
import { asApiPath } from '../../../../App';
import { addNewParamToSearchPath, SearchType } from '../SearchView';
import { useGetDecadePreviewThumbnailsQuery } from '../../../../graphql/APIConnector';
import { useSimplifiedQueryResponseData } from '../../../../graphql/queryUtils';
import { FlatDecadeThumbnails } from '../../../../graphql/additionalFlatTypes';

const DECADE_NAMES: string[] = ['40', '50', '60', '70', '80', '90'];

const DecadesList = () => {
  const { t } = useTranslation();
  const history: History = useHistory();

  const { data, loading, error } = useGetDecadePreviewThumbnailsQuery();
  const decadeThumbnails: FlatDecadeThumbnails | undefined = useSimplifiedQueryResponseData(data);

  if (error) {
    return <QueryErrorDisplay error={error} />;
  } else if (loading) {
    return <Loading />;
  } else if (decadeThumbnails) {
    return (
      <ItemList
        compact={true}
        items={DECADE_NAMES.map((name: string) => {
          const thumbnailData = decadeThumbnails[`s${name}`];
          const thumbnail: string = thumbnailData[0]?.media?.formats?.small?.url ?? '';
          const displayedName = name === '40' ? t('common.past') : `${name}er`;
          return {
            name: displayedName,
            background: asApiPath(thumbnail),
            onClick: () => {
              history.push(addNewParamToSearchPath(SearchType.DECADE, name), { showBack: true });
            },
          };
        })}
      />
    );
  } else return <div>{t('something-went-wrong')}</div>;
};

export default DecadesList;
