import { useTranslation } from 'react-i18next';
import React, { useEffect, useState } from 'react';
import { Picture, Scalars, useGetPicturesQuery } from '../../../graphql/APIConnector';
import PictureGrid from './PictureGrid';
import QueryErrorDisplay from '../../../components/QueryErrorDisplay';
import Loading from '../../../components/Loading';

const PictureScrollGrid = ({
  where,
  scrollPos,
  scrollHeight,
  hashbase,
}: {
  where: Scalars['JSON'];
  scrollPos: number;
  scrollHeight: number;
  hashbase: string;
}) => {
  const [lastScrollHeight, setLastScrollHeight] = useState<number>(0);

  const { data, loading, error, fetchMore } = useGetPicturesQuery({
    variables: {
      where,
      limit: 100,
      start: 0,
    },
    notifyOnNetworkStatusChange: true,
  });

  //Loads the next 100 Pictures when the user scrolled to the bottom
  useEffect(() => {
    if (
      !loading &&
      scrollPos &&
      scrollHeight &&
      scrollHeight !== lastScrollHeight &&
      scrollPos > scrollHeight - 1.5 * window.innerHeight
    ) {
      fetchMore({ variables: { start: data?.pictures?.length } });
      setLastScrollHeight(scrollHeight);
    }
  }, [scrollPos, scrollHeight, lastScrollHeight, data, loading, fetchMore]);

  if (error) {
    return <QueryErrorDisplay error={error} />;
  } else {
    if (data?.pictures?.length) {
      return <PictureGrid pictures={data.pictures as Picture[]} hashBase={hashbase} />;
    } else {
      return <Loading />;
    }
  }
};

export default PictureScrollGrid;
