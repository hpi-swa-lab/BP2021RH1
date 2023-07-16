import { WatchQueryFetchPolicy } from '@apollo/client';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSimplifiedQueryResponseData } from '../../../graphql/queryUtils';
import { useCachedOnRefetch } from '../../../hooks/cache-on-refetch.hook';
import { useAuth, useScroll } from '../../../hooks/context-hooks';
import useGetPictures, {
  NUMBER_OF_PICTURES_LOADED_PER_FETCH,
  QueryParams,
  TextFilter,
  createIdArrayFilter,
  wrapQueryParamsWithTextFilter,
} from '../../../hooks/get-pictures.hook';
import { useCollapseSequences } from '../../../hooks/sequences.hook';
import { FlatPicture } from '../../../types/additionalFlatTypes';
import Loading from '../Loading';
import QueryErrorDisplay from '../QueryErrorDisplay';
import { BulkOperation } from './BulkOperationsPanel';
import PictureGrid from './PictureGrid';
import { PicturePreviewAdornment } from './PicturePreview';
import './PictureScrollGrid.scss';
import PictureUploadArea, { PictureUploadAreaProps } from './PictureUploadArea';
import { TextFilterSelect } from './TextFilterSelect';

const PictureScrollGrid = ({
  queryParams,
  hashbase,
  isAllSearchActive = false,
  uploadAreaProps,
  resultPictureCallback,
  bulkOperations,
  sortBy,
  maxNumPictures,
  showCount = true,
  extraAdornments,
  showDefaultAdornments = true,
  allowClicks = true,
  collapseSequences = true,
  textFilter,
  fetchPolicy,
  cacheOnRefetch = false,
  onSort,
}: {
  queryParams: QueryParams;
  hashbase: string;
  isAllSearchActive?: boolean;
  uploadAreaProps?: Partial<PictureUploadAreaProps>;
  resultPictureCallback?: (pictures: number) => void;
  bulkOperations?: BulkOperation[];
  sortBy?: string[];
  maxNumPictures?: number;
  showCount?: boolean;
  extraAdornments?: PicturePreviewAdornment[];
  showDefaultAdornments?: boolean;
  allowClicks?: boolean;
  collapseSequences?: boolean;
  textFilter: TextFilter | null;
  fetchPolicy?: WatchQueryFetchPolicy;
  cacheOnRefetch?: boolean;
  onSort?: (newPictures: FlatPicture[]) => void;
}) => {
  const { t } = useTranslation();
  const [lastScrollHeight, setLastScrollHeight] = useState<number>(0);
  const [isFetching, setIsFetching] = useState<boolean>(false);

  const { loggedIn } = useAuth();
  const [selectedTextFilter, setSelectedTextFilter] = useState(
    textFilter ?? (loggedIn ? TextFilter.PICTURES_AND_TEXTS : TextFilter.ONLY_PICTURES)
  );

  useEffect(() => {
    if (textFilter === null) {
      setSelectedTextFilter(loggedIn ? TextFilter.PICTURES_AND_TEXTS : TextFilter.ONLY_PICTURES);
    }
  }, [textFilter, loggedIn]);

  const { data, loading, error, fetchMore, refetch } = useGetPictures(
    queryParams,
    isAllSearchActive,
    sortBy,
    selectedTextFilter,
    NUMBER_OF_PICTURES_LOADED_PER_FETCH,
    fetchPolicy
  );

  const pictures: FlatPicture[] | undefined = useSimplifiedQueryResponseData(data)?.pictures;

  const pictureIdToIndex = useMemo(() => {
    if (!(queryParams instanceof Array)) {
      return null;
    }
    const map = new Map(queryParams.map((id, index) => [id, index]));
    return map;
  }, [queryParams]);

  const sortedPictures = useMemo(
    () => (pictureIdToIndex && pictures ? sortPictures(pictures, pictureIdToIndex) : pictures),
    [pictureIdToIndex, pictures]
  );

  const collapsedPictures = useCollapseSequences(sortedPictures, collapseSequences);

  const processedPictures = useCachedOnRefetch(collapsedPictures, cacheOnRefetch);

  const { scrollPos, scrollHeight } = useScroll();

  useEffect(() => {
    if (resultPictureCallback && !loading) {
      resultPictureCallback(pictures?.length ?? 0);
    }
  }, [pictures, resultPictureCallback, loading]);

  const [nextFetchMoreIdArrayStart, setNextFetchMoreIdArrayStart] = useState(
    NUMBER_OF_PICTURES_LOADED_PER_FETCH
  );
  useEffect(() => {
    setNextFetchMoreIdArrayStart(NUMBER_OF_PICTURES_LOADED_PER_FETCH);
  }, [queryParams]);

  const maybeFetchMore = useCallback(async () => {
    if (loading) {
      return;
    }
    let fetchCount = NUMBER_OF_PICTURES_LOADED_PER_FETCH;
    if (maxNumPictures && pictures) {
      fetchCount = Math.min(maxNumPictures - pictures.length, NUMBER_OF_PICTURES_LOADED_PER_FETCH);
    }
    if (fetchCount > 0) {
      setIsFetching(true);
      if (queryParams instanceof Array) {
        setNextFetchMoreIdArrayStart(nextFetchMoreIdArrayStart + fetchCount);
        await fetchMore({
          variables: {
            filters: wrapQueryParamsWithTextFilter(
              selectedTextFilter,
              createIdArrayFilter(queryParams, nextFetchMoreIdArrayStart, fetchCount)
            ),
            pagination: {
              start: 0,
              limit: fetchCount,
            },
          },
        });
      } else {
        await fetchMore({
          variables: {
            pagination: {
              start: pictures?.length,
              limit: fetchCount,
            },
          },
        });
      }
      setIsFetching(false);
    }
  }, [
    loading,
    maxNumPictures,
    pictures,
    queryParams,
    fetchMore,
    selectedTextFilter,
    nextFetchMoreIdArrayStart,
  ]);

  // Loads the next NUMBER_OF_PICTURES_LOADED_PER_FETCH Pictures when the user scrolled to the bottom
  useEffect(() => {
    if (maxNumPictures && maxNumPictures < NUMBER_OF_PICTURES_LOADED_PER_FETCH) {
      // In that case, the initial fetch would be NUMBER_OF_PICTURES_LOADED_PER_FETCH
      // even if sth. else is defined.
      throw new Error(`maxNumPictures must be at least ${NUMBER_OF_PICTURES_LOADED_PER_FETCH}`);
    }

    if (
      scrollPos &&
      scrollHeight &&
      scrollHeight !== lastScrollHeight &&
      scrollPos > scrollHeight - 1.75 * window.innerHeight
    ) {
      maybeFetchMore();
      setLastScrollHeight(scrollHeight);
    }
  }, [
    scrollPos,
    scrollHeight,
    lastScrollHeight,
    pictures,
    loading,
    maxNumPictures,
    maybeFetchMore,
  ]);

  if (error) {
    return <QueryErrorDisplay error={error} />;
  } else if (loading && !processedPictures) {
    return <Loading />;
  } else if (processedPictures) {
    const possiblyMorePictures: boolean =
      !!pictures &&
      pictures.length > 0 &&
      pictures.length % NUMBER_OF_PICTURES_LOADED_PER_FETCH === 0;

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
        {showCount && (
          <span className='picture-count'>
            {t(possiblyMorePictures ? 'common.moreThanPictureCount' : 'common.pictureCount', {
              count: processedPictures.length,
            })}
          </span>
        )}
        {textFilter === null && (
          <div className='flex flex-row justify-end'>
            <TextFilterSelect value={selectedTextFilter} onChange={setSelectedTextFilter} />
          </div>
        )}
        <PictureGrid
          refetch={refetch}
          fetchMore={maybeFetchMore}
          pictures={processedPictures}
          hashBase={hashbase}
          loading={isFetching}
          bulkOperations={bulkOperations}
          extraAdornments={extraAdornments}
          showDefaultAdornments={showDefaultAdornments}
          allowClicks={allowClicks}
          onSort={onSort}
        />
      </>
    );
  } else {
    return <div> {t('common.no-picture')} </div>;
  }
};

export default PictureScrollGrid;

const sortPictures = (pictures: FlatPicture[], pictureIdToIndex: Map<string, number>) => {
  const sorted = new Array<FlatPicture | undefined>(pictures.length);
  for (const picture of pictures) {
    const index = pictureIdToIndex.get(picture.id)!;
    sorted[index] = picture;
  }
  return sorted.filter((element): element is FlatPicture => !!element);
};
