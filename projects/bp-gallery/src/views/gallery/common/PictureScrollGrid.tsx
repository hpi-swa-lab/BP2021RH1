import React, { useEffect, useState } from 'react';
import { PictureFiltersInput, useGetPicturesQuery } from '../../../graphql/APIConnector';
import { useSimplifiedQueryResponseData } from '../../../graphql/queryUtils';
import { FlatPicture } from '../../../graphql/additionalFlatTypes';
import PictureGrid from './PictureGrid';
import QueryErrorDisplay from '../../../components/QueryErrorDisplay';
import Loading from '../../../components/Loading';
import { useTranslation } from 'react-i18next';

const PictureScrollGrid = ({
  filters,
  scrollPos,
  scrollHeight,
  hashbase,
  previewPictureCallback,
  resultPictureCallback,
}: {
  filters: PictureFiltersInput;
  scrollPos: number;
  scrollHeight: number;
  hashbase: string;
  previewPictureCallback?: (picture: FlatPicture) => void;
  resultPictureCallback?: (pictures: boolean) => void;
}) => {
  const { t } = useTranslation();
  const [lastScrollHeight, setLastScrollHeight] = useState<number>(0);
  const [isFetching, setIsFetching] = useState<boolean>(false);

  const { data, loading, error, fetchMore } = useGetPicturesQuery({
    variables: {
      filters,
      pagination: {
        start: 0,
        limit: 100,
      },
    },
    notifyOnNetworkStatusChange: true,
  });

  // const totalPictureData = useGetPicturesIdQuery({
  //   variables: {
  //     filters,
  //     pagination: {},
  //   },
  //   notifyOnNetworkStatusChange: true,
  // });

  // const totalPicturesIds: FlatPicture[] | undefined = useSimplifiedQueryResponseData(
  //   totalPictureData.data
  // )?.pictures;
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
  } else if (pictures?.length) {
    return (
      <>
        <div>
          {pictures.length === 100
            ? '100+'
            : new Intl.NumberFormat('de-DE').format(pictures.length)}{' '}
          {t('common.pictures')}
        </div>
        <PictureGrid pictures={pictures} hashBase={hashbase} loading={isFetching} />
      </>
    );
  } else if (pictures?.length === 0 && resultPictureCallback) {
    return <div> {t('common.no-picture')} </div>;
  } else {
    return null;
  }
};

export default PictureScrollGrid;
