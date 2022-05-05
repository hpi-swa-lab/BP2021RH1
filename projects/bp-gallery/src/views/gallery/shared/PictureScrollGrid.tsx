import React, { useEffect, useState } from 'react';
import { PictureFiltersInput, useGetPicturesQuery } from '../../../graphql/APIConnector';
import { useSimplifiedQueryResponseData } from '../../../graphql/queryUtils';
import { FlatPicture } from '../../../types/additionalFlatTypes';
import PictureGrid from './PictureGrid';
import QueryErrorDisplay from '../../shared/QueryErrorDisplay';
import Loading from '../../shared/Loading';
import PictureUploadArea, { PictureUploadAreaProps } from './PictureUploadArea';
import { useTranslation } from 'react-i18next';

const PictureScrollGrid = ({
  filters,
  scrollPos,
  scrollHeight,
  hashbase,
  previewPictureCallback,
  resultPictureCallback,
  uploadAreaProps,
}: {
  filters: PictureFiltersInput;
  scrollPos: number;
  scrollHeight: number;
  hashbase: string;
  uploadAreaProps?: Partial<PictureUploadAreaProps>;
  previewPictureCallback?: (picture: FlatPicture) => void;
  resultPictureCallback?: (pictures: boolean) => void;
}) => {
  const { t } = useTranslation();
  const [lastScrollHeight, setLastScrollHeight] = useState<number>(0);
  const [isFetching, setIsFetching] = useState<boolean>(false);

  const { data, loading, error, fetchMore, refetch } = useGetPicturesQuery({
    variables: {
      filters,
      pagination: {
        start: 0,
        limit: 100,
      },
    },
    notifyOnNetworkStatusChange: true,
  });
  const pictures: FlatPicture[] | undefined = useSimplifiedQueryResponseData(data)?.pictures;

  useEffect(() => {
    if (previewPictureCallback && pictures && pictures.length) {
      previewPictureCallback(pictures[0]);
    }
  }, [pictures, previewPictureCallback]);

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
            limit: 100,
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
        <div
          style={{
            marginTop: '1rem',
            opacity: 0.5,
            textAlign: 'center',
          }}
        >
          {pictures.length === 100
            ? '100+'
            : new Intl.NumberFormat('de-DE').format(pictures.length)}{' '}
          {pictures.length === 1 ? t('search.picture-found') : t('search.pictures-found')}
        </div>
        <PictureGrid
          refetch={refetch}
          pictures={pictures}
          hashBase={hashbase}
          loading={isFetching}
        />
      </>
    );
  } else if (resultPictureCallback) {
    return <div> {t('common.no-picture')} </div>;
  } else {
    return null;
  }
};

export default PictureScrollGrid;
