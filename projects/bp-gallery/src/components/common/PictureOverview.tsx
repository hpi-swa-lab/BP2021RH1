import { MouseEventHandler } from 'react';
import { useTranslation } from 'react-i18next';
import { PictureFiltersInput } from '../../graphql/APIConnector';
import { useSimplifiedQueryResponseData } from '../../graphql/queryUtils';
import useGetPictures from '../../hooks/get-pictures.hook';
import { useCollapseSequences } from '../../hooks/sequences.hook';
import { FlatPicture, PictureOverviewType } from '../../types/additionalFlatTypes';
import './PictureOverview.scss';
import PrimaryButton from './PrimaryButton';
import PictureGrid from './picture-gallery/PictureGrid';

interface PictureOverviewProps {
  title?: string;
  queryParams: PictureFiltersInput | { searchTerms: string[]; searchTimes: string[][] };
  onClick: MouseEventHandler<HTMLButtonElement>;
  sortBy?: string[];
  rows?: number;
  type?: PictureOverviewType;
}

const ABSOLUTE_MAX_PICTURES_PER_ROW = 6;

const PictureOverview = ({
  title,
  queryParams,
  onClick,
  sortBy,
  rows = 2,
  type = PictureOverviewType.CUSTOM,
}: PictureOverviewProps) => {
  const { t } = useTranslation();

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
  const collapsedPictures = useCollapseSequences(pictures);

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
