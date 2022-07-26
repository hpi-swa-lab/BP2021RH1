import {
  GetPicturesByAllSearchQueryVariables,
  PictureFiltersInput,
  useGetPicturesByAllSearchQuery,
  useGetPicturesQuery,
} from '../graphql/APIConnector';
import { NUMBER_OF_PICTURES_LOADED_PER_FETCH } from '../components/common/picture-gallery/PictureScrollGrid';

const useGetPictures = (
  queryParams: PictureFiltersInput | { searchTerms: string[]; searchTimes: string[][] },
  isAllSearchActive: boolean,
  sortBy?: string[]
) => {
  const queryResult = useGetPicturesQuery({
    variables: {
      filters: queryParams as PictureFiltersInput,
      pagination: {
        start: 0,
        limit: NUMBER_OF_PICTURES_LOADED_PER_FETCH,
      },
      sortBy,
    },
    notifyOnNetworkStatusChange: true,
    skip: isAllSearchActive,
  });
  const customQueryResult = useGetPicturesByAllSearchQuery({
    variables: {
      ...(queryParams as GetPicturesByAllSearchQueryVariables),
      pagination: {
        start: 0,
        limit: NUMBER_OF_PICTURES_LOADED_PER_FETCH,
      },
    },
    notifyOnNetworkStatusChange: true,
    skip: !isAllSearchActive,
  });
  if (isAllSearchActive) {
    const reformattedResultData = { pictures: customQueryResult.data?.findPicturesByAllSearch };
    return { ...customQueryResult, data: reformattedResultData };
  } else {
    return queryResult;
  }
};

export default useGetPictures;
