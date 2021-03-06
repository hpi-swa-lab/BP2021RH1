import React from 'react';
import { useTranslation } from 'react-i18next';
import { History } from 'history';
import { useHistory } from 'react-router-dom';
import QueryErrorDisplay from '../../common/QueryErrorDisplay';
import Loading from '../../common/Loading';
import ScrollableItemList from '../../common/ScrollableItemList';
import { asApiPath } from '../../App';
import { SearchType } from './SearchView';
import {
  useGetDecadePreviewThumbnailsQuery,
  PictureFiltersInput,
} from '../../../graphql/APIConnector';
import { useSimplifiedQueryResponseData } from '../../../graphql/queryUtils';
import { FlatDecadeThumbnails } from '../../../types/additionalFlatTypes';
import { buildDecadeFilter, getDecadeSearchTermForAllSearch } from './helpers/search-filters';
import { getDecadeTranslation } from './helpers/search-translation';
import useAdvancedSearch from './helpers/useAdvancedSearch';
import { addNewParamToSearchPath } from './helpers/addNewParamToSearchPath';

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
      <ScrollableItemList
        compact={true}
        items={DECADES.map((decadeKey: string) => {
          const thumbnailData = decadeThumbnails[`decade${decadeKey}0s`];
          const thumbnail: string = thumbnailData[0]?.media?.formats?.small?.url;
          const displayedName = getDecadeTranslation(t, decadeKey);
          return {
            name: displayedName,
            background: thumbnail ? asApiPath(thumbnail) : DEFAULT_THUMBNAIL_URL,
            onClick: () => {
              const { searchPath } = useAdvancedSearch
                ? addNewParamToSearchPath(SearchType.DECADE, decadeKey)
                : addNewParamToSearchPath(
                    SearchType.ALL,
                    getDecadeSearchTermForAllSearch(decadeKey)
                  );

              history.push(searchPath, {
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
