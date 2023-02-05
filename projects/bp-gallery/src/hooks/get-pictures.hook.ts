import {
  GetPicturesByAllSearchQueryVariables,
  GetPicturesQuery,
  PictureFiltersInput,
  useGetPicturesByAllSearchQuery,
  useGetPicturesQuery,
} from '../graphql/APIConnector';
import { NUMBER_OF_PICTURES_LOADED_PER_FETCH } from '../components/common/picture-gallery/PictureScrollGrid';
import { AuthRole, useAuth } from '../components/provider/AuthProvider';

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

  const { role } = useAuth();

  type PictureData = NonNullable<GetPicturesQuery['pictures']>['data'][number];
  const filterOutTexts = (pictures: (PictureData | null | undefined)[] | null | undefined) => {
    if (!pictures) {
      return undefined;
    }
    return {
      pictures: {
        data:
          role >= AuthRole.CURATOR
            ? pictures
            : pictures.filter(picture => !picture?.attributes?.is_text),
      },
    };
  };

  if (isAllSearchActive) {
    return {
      ...customQueryResult,
      data: filterOutTexts(customQueryResult.data?.findPicturesByAllSearch),
    };
  } else {
    return {
      ...queryResult,
      data: filterOutTexts(queryResult.data?.pictures?.data),
    };
  }
};

export default useGetPictures;
