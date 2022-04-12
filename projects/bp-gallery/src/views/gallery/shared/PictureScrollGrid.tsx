import React, { useEffect, useState } from 'react';
import { PictureFiltersInput, useGetPicturesQuery } from '../../../graphql/APIConnector';
import { useSimplifiedQueryResponseData } from '../../../graphql/queryUtils';
import { FlatPicture } from '../../../types/additionalFlatTypes';
import PictureGrid from './PictureGrid';
import QueryErrorDisplay from '../../shared/QueryErrorDisplay';
import Loading from '../../shared/Loading';
import PictureUploadArea, { PictureUploadAreaProps } from './PictureUploadArea';
import { useTranslation } from 'react-i18next';
import './PictureScrollGrid.scss';

const PictureScrollGrid = ({
  filters,
  scrollPos,
  scrollHeight,
  hashbase,
  uploadAreaProps,
  resultPictureCallback,
}: {
  filters: PictureFiltersInput;
  scrollPos: number;
  scrollHeight: number;
  hashbase: string;
  uploadAreaProps?: Partial<PictureUploadAreaProps>;
  resultPictureCallback?: (pictures: boolean) => void;
}) => {
  const [lastScrollHeight, setLastScrollHeight] = useState<number>(0);
  const [isFetching, setIsFetching] = useState<boolean>(false);

  const NUMBER_OF_PICTURES_LOADED_PER_FETCH = 100;

  const { data, loading, error, fetchMore, refetch } = useGetPicturesQuery({
    variables: {
      filters,
      pagination: {
        start: 0,
        limit: NUMBER_OF_PICTURES_LOADED_PER_FETCH,
      },
    },
    notifyOnNetworkStatusChange: true,
  });
  const pictures: FlatPicture[] | undefined = useSimplifiedQueryResponseData(data)?.pictures;
  const { t } = useTranslation();

  useEffect(() => {
    if (resultPictureCallback) {
      resultPictureCallback(pictures?.length !== 0);
    }
  }, [pictures, resultPictureCallback]);

  // Loads the next 100 Pictures when the user scrolled to the bottom
  useEffect(() => {
    if (
      !loading &&
      scrollPos &&
      scrollHeight &&
      scrollHeight !== lastScrollHeight &&
      scrollPos > scrollHeight - 1.5 * window.innerHeight
    ) {
      setIsFetching(true);
      fetchMore({
        variables: {
          pagination: {
            start: pictures?.length,
            limit: NUMBER_OF_PICTURES_LOADED_PER_FETCH,
          },
        },
      }).then(() => setIsFetching(false));
      setLastScrollHeight(scrollHeight);
    }
  }, [scrollPos, scrollHeight, lastScrollHeight, pictures, loading, fetchMore]);

  if (error) {
    return <QueryErrorDisplay error={error} />;
  } else if (loading && !pictures) {
    return <Loading />;
  } else if (pictures) {
    const possiblyMorePictures: boolean =
      pictures.length > 0 && pictures.length % NUMBER_OF_PICTURES_LOADED_PER_FETCH === 0;

    return (
      <>
        <PictureUploadArea
          {...uploadAreaProps}
          onUploaded={() => {
            refetch();
            if (uploadAreaProps?.onUploaded) {
              uploadAreaProps.onUploaded();
            }
          }}
        />
        <span className='picture-count'>
          {t(
            pictures.length === 0
              ? 'common.noPictures'
              : possiblyMorePictures
              ? 'common.moreThanPictureCount'
              : 'common.pictureCount',
            {
              count: pictures.length,
            }
          )}
        </span>
        <PictureGrid
          refetch={refetch}
          pictures={pictures}
          hashBase={hashbase}
          loading={isFetching}
        />
      </>
    );
  } else {
    return <div> {t('common.no-picture')} </div>;
  }
};

export default PictureScrollGrid;
