import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { PictureFiltersInput } from '../../../graphql/APIConnector';
import { useSimplifiedQueryResponseData } from '../../../graphql/queryUtils';
import useGetPictures, {
  NUMBER_OF_PICTURES_LOADED_PER_FETCH,
} from '../../../hooks/get-pictures.hook';
import { FlatPicture } from '../../../types/additionalFlatTypes';
import Loading from '../Loading';
import QueryErrorDisplay from '../QueryErrorDisplay';
import { BulkOperation } from './BulkOperationsPanel';
import PictureGrid from './PictureGrid';
import { PicturePreviewAdornment } from './PicturePreview';
import './PictureScrollGrid.scss';
import PictureUploadArea, { PictureUploadAreaProps } from './PictureUploadArea';

const PictureScrollGrid = ({
  queryParams,
  scrollPos,
  scrollHeight,
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
  filterOutTextsForNonCurators = true,
}: {
  queryParams: PictureFiltersInput | { searchTerms: string[]; searchTimes: string[][] };
  scrollPos: number;
  scrollHeight: number;
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
  filterOutTextsForNonCurators?: boolean;
}) => {
  const { t } = useTranslation();
  const [lastScrollHeight, setLastScrollHeight] = useState<number>(0);
  const [isFetching, setIsFetching] = useState<boolean>(false);

  const { data, loading, error, fetchMore, refetch } = useGetPictures(
    queryParams,
    isAllSearchActive,
    sortBy,
    filterOutTextsForNonCurators
  );

  const pictures: FlatPicture[] | undefined = useSimplifiedQueryResponseData(data)?.pictures;

  useEffect(() => {
    if (resultPictureCallback && !loading) {
      resultPictureCallback(pictures?.length ?? 0);
    }
  }, [pictures, resultPictureCallback, loading]);

  // Loads the next NUMBER_OF_PICTURES_LOADED_PER_FETCH Pictures when the user scrolled to the bottom
  useEffect(() => {
    if (maxNumPictures && maxNumPictures < NUMBER_OF_PICTURES_LOADED_PER_FETCH) {
      // In that case, the initial fetch would be NUMBER_OF_PICTURES_LOADED_PER_FETCH
      // even if sth. else is defined.
      throw new Error(`maxNumPictures must be at least ${NUMBER_OF_PICTURES_LOADED_PER_FETCH}`);
    }

    if (
      !loading &&
      scrollPos &&
      scrollHeight &&
      scrollHeight !== lastScrollHeight &&
      scrollPos > scrollHeight - 1.5 * window.innerHeight
    ) {
      let fetchCount = NUMBER_OF_PICTURES_LOADED_PER_FETCH;
      if (maxNumPictures && pictures) {
        fetchCount = Math.min(
          maxNumPictures - pictures.length,
          NUMBER_OF_PICTURES_LOADED_PER_FETCH
        );
      }
      if (fetchCount > 0) {
        setIsFetching(true);
        // @ts-ignore
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        fetchMore({
          variables: {
            pagination: {
              start: pictures?.length,
              limit: fetchCount,
            },
          },
        }).then(() => setIsFetching(false));
      }
      setLastScrollHeight(scrollHeight);
    }
  }, [scrollPos, scrollHeight, lastScrollHeight, pictures, loading, fetchMore, maxNumPictures]);

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
        {showCount && (
          <span className='picture-count'>
            {t(possiblyMorePictures ? 'common.moreThanPictureCount' : 'common.pictureCount', {
              count: pictures.length,
            })}
          </span>
        )}
        <PictureGrid
          refetch={refetch}
          pictures={pictures}
          hashBase={hashbase}
          loading={isFetching}
          bulkOperations={bulkOperations}
          extraAdornments={extraAdornments}
          showDefaultAdornments={showDefaultAdornments}
          allowClicks={allowClicks}
        />
      </>
    );
  } else {
    return <div> {t('common.no-picture')} </div>;
  }
};

export default PictureScrollGrid;
