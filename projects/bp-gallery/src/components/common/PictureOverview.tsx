import { Button } from '@mui/material';
import React, { MouseEventHandler } from 'react';
import { ArrowForwardIos } from '@mui/icons-material';
import './PictureOverview.scss';
import PictureGrid from './picture-gallery/PictureGrid';
import { useSimplifiedQueryResponseData } from '../../graphql/queryUtils';
import { PictureFiltersInput } from '../../graphql/APIConnector';
import { FlatPicture } from '../../types/additionalFlatTypes';
import { useTranslation } from 'react-i18next';
import useGetPictures from '../../hooks/get-pictures.hook';

interface PictureOverviewProps {
  title: string;
  queryParams: PictureFiltersInput | { searchTerms: string[]; searchTimes: string[][] };
  onClick: MouseEventHandler<HTMLButtonElement>;
  sortBy?: string[];
  rows?: number;
}

const PictureOverview = ({
  title,
  queryParams,
  onClick,
  sortBy,
  rows = 2,
}: PictureOverviewProps) => {
  const { t } = useTranslation();

  const { data, loading, refetch } = useGetPictures(queryParams, false, sortBy, true, 6 * rows);

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
      <Button onClick={onClick} className='overview-show-more-button' endIcon={<ArrowForwardIos />}>
        {t('common.showMore')}
      </Button>
    </div>
  );
};

export default PictureOverview;
