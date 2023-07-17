import { useTranslation } from 'react-i18next';
import {
  PictureFiltersInput,
  useGetDecadePreviewThumbnailsQuery,
} from '../../../graphql/APIConnector';
import { useSimplifiedQueryResponseData } from '../../../graphql/queryUtils';
import { asUploadPath } from '../../../helpers/app-helpers';
import { FlatDecadeThumbnails } from '../../../types/additionalFlatTypes';
import ItemList from '../../common/ItemList';
import Loading from '../../common/Loading';
import QueryErrorDisplay from '../../common/QueryErrorDisplay';
import ScrollableItemList from '../../common/ScrollableItemList';
import { useVisit } from './../../../helpers/history';
import { addNewParamToSearchPath } from './helpers/addNewParamToSearchPath';
import {
  SearchType,
  buildDecadeFilter,
  getDecadeSearchTermForAllSearch,
} from './helpers/search-filters';
import { getDecadeTranslation } from './helpers/search-translation';
import useAdvancedSearch from './helpers/useDeprecatedAdvancedSearch';

const DECADES: string[] = ['4', '5', '6', '7', '8', '9'];

const DecadesList = ({
  scroll = true,
  onClickBasePath,
  thumbnailQueryParams,
  currentItemAmount,
}: {
  scroll?: boolean;
  onClickBasePath?: string;
  thumbnailQueryParams?: PictureFiltersInput;
  currentItemAmount?: number;
}) => {
  const { t } = useTranslation();
  const { visit } = useVisit();

  const DEFAULT_THUMBNAIL_URL = '/bad-harzburg-stiftung-logo.png';
  const decadeToFilter: { [key: string]: PictureFiltersInput | undefined } = {};
  DECADES.forEach(decade => {
    const decadeName = `filter${decade}0s`;
    decadeToFilter[decadeName] = buildDecadeFilter(decade, thumbnailQueryParams);
  });
  const { data, loading, error } = useGetDecadePreviewThumbnailsQuery({
    // @ts-ignore
    variables: decadeToFilter,
  });
  const decadeThumbnails: FlatDecadeThumbnails | undefined = useSimplifiedQueryResponseData(data);

  const getDecadeDisplay = (decadeKey: string) => {
    if (!decadeThumbnails) {
      return;
    }
    const thumbnailData = decadeThumbnails[`decade${decadeKey}0s`];
    const displayedName = getDecadeTranslation(t, decadeKey);
    return {
      name: displayedName,
      background: asUploadPath(thumbnailData[0]?.media, {
        highQuality: false,
        fallback: DEFAULT_THUMBNAIL_URL,
      }),
    };
  };

  if (error) {
    return <QueryErrorDisplay error={error} />;
  } else if (loading) {
    return <Loading />;
  } else if (decadeThumbnails) {
    if (scroll) {
      return (
        <ScrollableItemList
          compact={true}
          items={DECADES.map((decadeKey: string) => {
            return {
              ...getDecadeDisplay(decadeKey)!,
              onClick: () => {
                const { searchPath } = useAdvancedSearch
                  ? addNewParamToSearchPath(SearchType.DECADE, decadeKey)
                  : addNewParamToSearchPath(
                      SearchType.ALL,
                      getDecadeSearchTermForAllSearch(decadeKey)
                    );

                visit(searchPath);
              },
            };
          })}
        />
      );
    } else if (onClickBasePath) {
      return (
        <ItemList
          items={(currentItemAmount ? DECADES.slice(0, currentItemAmount) : DECADES).map(
            (decadeKey: string) => {
              return {
                ...getDecadeDisplay(decadeKey)!,
                onClick: () => {
                  if (onClickBasePath) {
                    visit(onClickBasePath + decadeKey);
                  }
                },
              };
            }
          )}
        />
      );
    } else return <div>{t('something-went-wrong')}</div>;
  } else return <div>{t('something-went-wrong')}</div>;
};

export default DecadesList;
