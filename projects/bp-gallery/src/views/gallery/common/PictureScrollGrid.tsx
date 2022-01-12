import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Picture, Scalars, useGetPicturesQuery } from '../../../graphql/APIConnector';
import PictureGrid from './PictureGrid';
import QueryErrorDisplay from '../../../components/QueryErrorDisplay';
import Loading from '../../../components/Loading';

const PictureScrollGrid = ({
  where,
  scrollPos,
  scrollHeight,
  hashbase,
  previewPictureCallback,
}: {
  where: Scalars['JSON'];
  scrollPos: number;
  scrollHeight: number;
  hashbase: string;
  previewPictureCallback?: (picture: Picture) => void;
}) => {
  const { t } = useTranslation();
  const [lastScrollHeight, setLastScrollHeight] = useState<number>(0);
  const [isFetching, setIsFetching] = useState<boolean>(false);

  const { data, loading, error, fetchMore } = useGetPicturesQuery({
    variables: {
      where,
      limit: 100,
      start: 0,
    },
    notifyOnNetworkStatusChange: true,
  });

  useEffect(() => {
    if (previewPictureCallback && data?.pictures && data.pictures.length) {
      previewPictureCallback(data.pictures[0] as Picture);
    }
  }, [data?.pictures, previewPictureCallback]);

  //Loads the next 100 Pictures when the user scrolled to the bottom
  useEffect(() => {
    if (
      !loading &&
      scrollPos &&
      scrollHeight &&
      scrollHeight !== lastScrollHeight &&
      scrollPos > scrollHeight - 1.5 * window.innerHeight
    ) {
      setIsFetching(true);
      fetchMore({ variables: { start: data?.pictures?.length } }).then(() => setIsFetching(false));
      setLastScrollHeight(scrollHeight);
    }
  }, [scrollPos, scrollHeight, lastScrollHeight, data, loading, fetchMore]);

  if (error) {
    return <QueryErrorDisplay error={error} />;
  } else if (loading && !data?.pictures) {
    return <Loading />;
  } else if (data?.pictures?.length) {
    return (
      <PictureGrid pictures={data.pictures as Picture[]} hashBase={hashbase} loading={isFetching} />
    );
  } else {
    return <div>{t('common.no-picture')}</div>;
  }
};

export default PictureScrollGrid;
