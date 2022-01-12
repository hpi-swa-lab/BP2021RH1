import { useGetDecadePreviewThumbnailsQuery } from '../../../../graphql/APIConnector';
import React from 'react';
import QueryErrorDisplay from '../../../../components/QueryErrorDisplay';
import Loading from '../../../../components/Loading';
import ItemList from '../../common/ItemList';
import { asApiPath } from '../../../../App';
import { asSearchPath, SearchType } from '../SearchView';
import { History } from 'history';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const DecadesList = () => {
  const history: History = useHistory();
  const { t } = useTranslation();

  const decadeThumbnails = useGetDecadePreviewThumbnailsQuery();

  if (decadeThumbnails.error) {
    return <QueryErrorDisplay error={decadeThumbnails.error} />;
  } else if (decadeThumbnails.loading) {
    return <Loading />;
  } else if (decadeThumbnails.data) {
    return (
      <ItemList
        compact={true}
        items={Array(6)
          .fill(0)
          .map((_, index) => {
            let name: string;
            let thumbnailData;
            if (index === 0) {
              name = t('common.previous');
              thumbnailData = (decadeThumbnails.data as any)['s00'];
            } else {
              name = `${(index + 4) * 10}er`;
              thumbnailData = (decadeThumbnails.data as any)[`s${(index + 4) * 10}`];
            }
            const thumbnail: string = thumbnailData[0]?.media?.formats?.small?.url ?? '';
            return {
              name,
              background: asApiPath(thumbnail),
              onClick: () => {
                history.push(asSearchPath([{ value: name, type: SearchType.DECADE }]), {
                  showBack: true,
                });
              },
            };
          })}
      />
    );
  } else return <div>{t('something-went-wrong')}</div>;
};

export default DecadesList;
