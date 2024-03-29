import { ArrowForwardIos } from '@mui/icons-material';
import { Button } from '@mui/material';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useSimplifiedQueryResponseData } from '../../graphql/queryUtils';
import { useVisit } from '../../helpers/history';
import useGetPictures, { QueryParams, TextFilter } from '../../hooks/get-pictures.hook';
import { useCollapseSequences } from '../../hooks/sequences.hook';
import { FlatPicture, PictureOverviewType } from '../../types/additionalFlatTypes';
import './PictureOverview.scss';
import PictureGrid from './picture-gallery/PictureGrid';
import { pictureGridInitialPictureIdUrlParam } from './picture-gallery/helpers/constants';

interface PictureOverviewProps {
  title?: string;
  queryParams: QueryParams;
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
    TextFilter.ONLY_PICTURES,
    ABSOLUTE_MAX_PICTURES_PER_ROW * rows,
    'cache-and-network',
    type
  );

  const pictures: FlatPicture[] | undefined = useSimplifiedQueryResponseData(data)?.pictures;
  const collapsedPictures = useCollapseSequences(pictures);

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
      {collapsedPictures && (
        <div className='overview-picture-grid-container'>
          <PictureGrid
            pictures={collapsedPictures}
            hashBase={'overview'}
            loading={loading}
            refetch={refetch}
            fetchMore={navigateToShowMore}
            showDefaultAdornments={false}
            rows={rows}
          />
        </div>
      )}
      <Button
        onClick={onClick}
        endIcon={<ArrowForwardIos />}
        variant='contained'
        className='w-fit self-center'
      >
        {t('common.showMore')}
      </Button>
    </div>
  );
};

export default PictureOverview;
