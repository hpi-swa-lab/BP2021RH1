import { useCallback, useState } from 'react';
import ScrollBar from 'react-perfect-scrollbar';
import { PictureFiltersInput } from '../../../graphql/APIConnector';
import { useSimplifiedQueryResponseData } from '../../../graphql/queryUtils';
import useGetPictures from '../../../hooks/get-pictures.hook';
import { FlatPicture, PictureOverviewType } from '../../../types/additionalFlatTypes';
import PicturePreview from './PicturePreview';

const PictureWidget = ({
  variant,
  pictures,
  allowClicks,
}: {
  variant?: string;
  pictures: FlatPicture[];
  allowClicks?: boolean;
}) => {
  if (variant === 'var-1') {
    return (
      <div className={`flex flex-col gap-[10px]`}>
        <div className={`w-[260px] h-[200px]`}>
          {pictures.length > 0 ? (
            <PicturePreview
              key={`${pictures[0].id}`}
              picture={pictures[0]}
              adornments={[]}
              allowClicks={allowClicks}
              onClick={() => {}}
              inverse={true}
            />
          ) : null}
        </div>
        <div className='flex flex-row gap-[10px]'>
          <div className={`w-[125px] h-[100px]`}>
            {pictures.length > 1 ? (
              <PicturePreview
                key={`${pictures[1].id}`}
                picture={pictures[1]}
                adornments={[]}
                allowClicks={allowClicks}
                onClick={() => {}}
                inverse={true}
              />
            ) : null}
          </div>
          <div className={`w-[125px] h-[100px]`}>
            {pictures.length > 2 ? (
              <PicturePreview
                key={`${pictures[2].id}`}
                picture={pictures[2]}
                adornments={[]}
                allowClicks={allowClicks}
                onClick={() => {}}
                inverse={true}
              />
            ) : null}
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div className={`flex flex-col gap-[10px]`}>
        <div className='flex flex-row gap-[10px]'>
          <div className={`w-[125px] h-[100px]`}>
            {pictures.length > 0 ? (
              <PicturePreview
                key={`${pictures[0].id}`}
                picture={pictures[0]}
                adornments={[]}
                allowClicks={allowClicks}
                onClick={() => {}}
                inverse={true}
              />
            ) : null}
          </div>
          <div className={`w-[125px] h-[100px]`}>
            {pictures.length > 1 ? (
              <PicturePreview
                key={`${pictures[1].id}`}
                picture={pictures[1]}
                adornments={[]}
                allowClicks={allowClicks}
                onClick={() => {}}
                inverse={true}
              />
            ) : null}
          </div>
        </div>
        <div className={`w-[260px] h-[200px]`}>
          {pictures.length > 2 ? (
            <PicturePreview
              key={`${pictures[2].id}`}
              picture={pictures[2]}
              adornments={[]}
              allowClicks={allowClicks}
              onClick={() => {}}
              inverse={true}
            />
          ) : null}
        </div>
      </div>
    );
  }
};

const HorizontalPictureGrid = ({
  queryParams,
  sortBy,
  type = PictureOverviewType.CUSTOM,
}: {
  queryParams: PictureFiltersInput | { searchTerms: string[]; searchTimes: string[][] };
  sortBy?: string[];
  type?: PictureOverviewType;
}) => {
  const { data, loading, refetch, fetchMore } = useGetPictures(
    queryParams,
    false,
    sortBy,
    true,
    100,
    'cache-and-network',
    type
  );

  const pictures: FlatPicture[] | undefined = useSimplifiedQueryResponseData(data)?.pictures;

  const [scrollBarRef, setScrollBarRef] = useState<HTMLElement>();
  const [showLeftButton, setShowLeftButton] = useState<boolean>(false);
  const [showRightButton, setShowRightButton] = useState<boolean>(true);
  const [lastScrollPos, setLastScrollPos] = useState<number>(0);
  const [isFetching, setIsFetching] = useState<boolean>(false);

  const fetchMoreOnScroll = useCallback(
    (count: number) => {
      // @ts-ignore
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      fetchMore({
        variables: {
          pagination: {
            start: pictures?.length,
            limit: count,
          },
        },
      });
    },
    [fetchMore, pictures]
  );

  const scrollElements = (count: number) => {
    if (!scrollBarRef) {
      return;
    }
    const elementWidth = 260 + 10;
    scrollBarRef.scroll({
      top: 0,
      left: scrollBarRef.scrollLeft + elementWidth * count,
      behavior: 'auto',
    });
    if (count > 0) {
      fetchMoreOnScroll(count * 3);
    }
  };

  console.log(scrollBarRef?.scrollLeft);

  return (
    <div className='relative'>
      <ScrollBar
        containerRef={ref => {
          setScrollBarRef(ref);
        }}
        onScrollX={() => {
          setShowLeftButton(true);
          setShowRightButton(true);
        }}
        onXReachStart={() => {
          setShowLeftButton(false);
        }}
        onXReachEnd={ref => {
          setShowRightButton(false);
          if (ref.scrollLeft !== lastScrollPos) {
            fetchMoreOnScroll(5);
            setLastScrollPos(ref.scrollLeft);
          }
        }}
      >
        <div className='flex gap-[10px] p-[16px]'>
          {pictures?.map((_, index) => {
            if (!(index % 3)) {
              return (
                <PictureWidget
                  key={index}
                  variant={index % 6 ? 'var-1' : 'var-2'}
                  pictures={pictures.slice(index, index + 3)}
                />
              );
            } else {
              return null;
            }
          })}
        </div>
      </ScrollBar>
    </div>
  );
};

export default HorizontalPictureGrid;
