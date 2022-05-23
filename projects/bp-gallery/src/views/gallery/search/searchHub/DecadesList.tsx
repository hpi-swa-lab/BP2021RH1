import React from 'react';
import { useTranslation } from 'react-i18next';
import { History } from 'history';
import { useHistory } from 'react-router-dom';
import QueryErrorDisplay from '../../../shared/QueryErrorDisplay';
import Loading from '../../../shared/Loading';
import ItemList from '../../shared/ItemList';
import { asApiPath } from '../../../../App';
import { addNewParamToSearchPath, SearchType } from '../SearchView';
import {
  useGetDecadePreviewThumbnailsQuery,
  PictureFiltersInput,
} from '../../../../graphql/APIConnector';
import { useSimplifiedQueryResponseData } from '../../../../graphql/queryUtils';
import { FlatDecadeThumbnails } from '../../../../types/additionalFlatTypes';
import { buildDecadeFilter } from '../helpers/search-filters';

const DECADES: string[] = ['4', '5', '6', '7', '8', '9'];

const DecadesList = () => {
  const { t } = useTranslation();
  const history: History = useHistory();

  const DEFAULT_THUMBNAIL_URL = '/bad-harzburg-stiftung-logo.png';
  const decadeToFilter: { [key: string]: PictureFiltersInput | undefined } = {};
  DECADES.forEach(decade => {
    const decadeName = `filter${decade}0s`;
    decadeToFilter[decadeName] = buildDecadeFilter(decade);
  });
  const { data, loading, error } = useGetDecadePreviewThumbnailsQuery({
    // @ts-ignore
    variables: decadeToFilter,
  });
  const decadeThumbnails: FlatDecadeThumbnails | undefined = useSimplifiedQueryResponseData(data);

  if (error) {
    return <QueryErrorDisplay error={error} />;
  } else if (loading) {
    return <Loading />;
  } else if (decadeThumbnails) {
    return (
      <ItemList
        compact={true}
        items={DECADES.map((name: string) => {
          const thumbnailData = decadeThumbnails[`decade${name}0s`];
          const thumbnail: string = thumbnailData[0]?.media?.formats?.small?.url;
          const displayedName = name === '4' ? t('common.past') : `${name}0er`;
          return {
            name: displayedName,
            background: thumbnail ? asApiPath(thumbnail) : DEFAULT_THUMBNAIL_URL,
            onClick: () => {
              history.push(addNewParamToSearchPath(SearchType.DECADE, name).searchVal, {
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
