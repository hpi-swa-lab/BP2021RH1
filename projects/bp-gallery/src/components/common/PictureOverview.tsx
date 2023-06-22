import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { PictureFiltersInput } from '../../graphql/APIConnector';
import { useSimplifiedQueryResponseData } from '../../graphql/queryUtils';
import { useVisit } from '../../helpers/history';
import useGetPictures from '../../hooks/get-pictures.hook';
import { FlatPicture, PictureOverviewType } from '../../types/additionalFlatTypes';
import './PictureOverview.scss';
import PrimaryButton from './PrimaryButton';
import PictureGrid from './picture-gallery/PictureGrid';
import { pictureGridInitialPictureIdUrlParam } from './picture-gallery/helpers/constants';

interface PictureOverviewProps {
  title?: string;
  queryParams: PictureFiltersInput | { searchTerms: string[]; searchTimes: string[][] };
  showMoreUrl: string;
  sortBy?: string[];
  rows?: number;
  type?: PictureOverviewType;
}

const ABSOLUTE_MAX_PICTURES_PER_ROW = 6;

const PictureOverview = ({
  title,
  queryParams,
  showMoreUrl,
  sortBy,
  rows = 2,
  type = PictureOverviewType.CUSTOM,
}: PictureOverviewProps) => {
  const { t } = useTranslation();
  const { visit } = useVisit();

  const { data, loading, refetch } = useGetPictures(
    queryParams,
    false,
    sortBy,
    true,
    ABSOLUTE_MAX_PICTURES_PER_ROW * rows,
    'cache-and-network',
    type
  );

  const pictures: FlatPicture[] | undefined = useSimplifiedQueryResponseData(data)?.pictures;

  const onClick = useCallback(() => {
    visit(showMoreUrl);
  }, [visit, showMoreUrl]);

  const navigateToShowMore = useCallback(
    (initialPictureId: string) => {
      visit(`${showMoreUrl}?${pictureGridInitialPictureIdUrlParam}=${initialPictureId}`);
    },
    [showMoreUrl, visit]
  );

  return (
    <div className='overview-container'>
      {title && <h2 className='overview-title'>{title}</h2>}
      {pictures && (
        <div className='overview-picture-grid-container'>
          <PictureGrid
            pictures={pictures}
            hashBase={'overview'}
            loading={loading}
            refetch={refetch}
            fetchMore={navigateToShowMore}
            showDefaultAdornments={false}
            rows={rows}
          />
        </div>
      )}
      <PrimaryButton onClickFn={onClick} isShowMore={true}>
        {t('common.showMore')}
      </PrimaryButton>
    </div>
  );
};

export default PictureOverview;
