import React, { useEffect, useState } from 'react';
import { PictureFiltersInput, useGetPicturesQuery } from '../../../graphql/APIConnector';
import { useSimplifiedQueryResponseData } from '../../../graphql/queryUtils';
import { FlatPicture } from '../../../types/additionalFlatTypes';
import PictureGrid from './PictureGrid';
import QueryErrorDisplay from '../../shared/QueryErrorDisplay';
import Loading from '../../shared/Loading';
import { PictureUploadAreaProps } from './PictureUploadArea';

const PictureScrollGrid = ({
  filters,
  scrollPos,
  scrollHeight,
  hashbase,
  previewPictureCallback,
  uploadAreaProps,
}: {
  filters: PictureFiltersInput;
  scrollPos: number;
  scrollHeight: number;
  hashbase: string;
  previewPictureCallback?: (picture: FlatPicture) => void;
  uploadAreaProps?: Partial<PictureUploadAreaProps>;
}) => {
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
      <PictureGrid
        {...uploadAreaProps}
        onUploaded={() => {
          refetch();
          if (uploadAreaProps?.onUploaded) {
            uploadAreaProps.onUploaded();
          }
        }}
        refetch={refetch}
        pictures={pictures}
        hashBase={hashbase}
        loading={isFetching}
      />
    );
  } else {
    return null;
  }
};

export default PictureScrollGrid;
