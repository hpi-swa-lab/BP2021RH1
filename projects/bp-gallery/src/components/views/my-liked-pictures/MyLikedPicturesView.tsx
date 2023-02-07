import { Typography } from '@mui/material';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import useLikes from '../../../hooks/likes.hook';
import PictureScrollGrid from '../../common/picture-gallery/PictureScrollGrid';
import ScrollContainer from '../../common/ScrollContainer';

const MyLikedPicturesView = () => {
  const { t } = useTranslation();

  const [pictureIds] = useLikes();

  const queryParams = useMemo(
    () => ({
      id: {
        in: pictureIds,
      },
    }),
    [pictureIds]
  );

  return (
    <div className='my-liked-pictures'>
      <Typography>
        <h1>{t('my-liked-pictures.title')}</h1>
      </Typography>
      <ScrollContainer>
        {(scrollPos: number, scrollHeight: number) => (
          <PictureScrollGrid
            queryParams={queryParams}
            scrollPos={scrollPos}
            scrollHeight={scrollHeight}
            hashbase={'liked'}
          />
        )}
      </ScrollContainer>
    </div>
  );
};

export default MyLikedPicturesView;
