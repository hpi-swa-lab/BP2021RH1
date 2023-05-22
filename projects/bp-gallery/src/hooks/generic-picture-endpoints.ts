import { useMemo } from 'react';
import { useGetMostLikedPicturesQuery, useGetPicturesQuery } from '../graphql/APIConnector';
import { PictureOverviewType } from '../types/additionalFlatTypes';

const useGenericPictureEndpoints = (type: PictureOverviewType) => {
  return useMemo(() => {
    switch (type) {
      case PictureOverviewType.MOST_LIKED:
        return {
          getPicturesQuery: useGetMostLikedPicturesQuery,
        };
      default:
        return {
          getPicturesQuery: useGetPicturesQuery,
        };
    }
  }, [type]);
};

export default useGenericPictureEndpoints;
