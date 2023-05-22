import { MouseEventHandler } from 'react';
import { useTranslation } from 'react-i18next';
import { PictureFiltersInput } from '../../graphql/APIConnector';
import { useSimplifiedQueryResponseData } from '../../graphql/queryUtils';
import useGetPictures, { TextFilter } from '../../hooks/get-pictures.hook';
import { FlatPicture } from '../../types/additionalFlatTypes';
import './PictureOverview.scss';
import PrimaryButton from './PrimaryButton';
import PictureGrid from './picture-gallery/PictureGrid';

interface PictureOverviewProps {
  title: string;
  queryParams: PictureFiltersInput | { searchTerms: string[]; searchTimes: string[][] };
  onClick: MouseEventHandler<HTMLButtonElement>;
  sortBy?: string[];
  rows?: number;
}

const ABSOLUTE_MAX_PICTURES_PER_ROW = 6;

const PictureOverview = ({
  title,
  queryParams,
  onClick,
  sortBy,
  rows = 2,
}: PictureOverviewProps) => {
  const { t } = useTranslation();

  const { data, loading, refetch } = useGetPictures(
    queryParams,
    false,
    sortBy,
    TextFilter.ONLY_PICTURES,
    ABSOLUTE_MAX_PICTURES_PER_ROW * rows
  );

  const pictures: FlatPicture[] | undefined = useSimplifiedQueryResponseData(data)?.pictures;

  return (
    <div className='overview-container'>
      <h2 className='overview-title'>{title}</h2>
      {pictures && (
        <div className='overview-picture-grid-container'>
          <PictureGrid
            pictures={pictures}
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
