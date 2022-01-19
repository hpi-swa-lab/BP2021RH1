import React, {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import './PictureView.scss';
import { asApiPath } from '../../App';
import { useHistory } from 'react-router-dom';
import { History } from 'history';
import { useGetPictureInfoLazyQuery } from '../../graphql/APIConnector';
import { FlatPicture } from '../../graphql/additionalFlatTypes';
import { nextImageAnimation, zoomIntoPicture, zoomOutOfPicture } from './picture.helpers';
import PictureViewUI, { PictureNavigationTarget } from './PictureViewUI';
import { useFlatQueryResponseData } from '../../graphql/queryUtils';
import PictureInfo from './components/PictureInfo';

export interface PictureViewContextFields {
  navigatePicture?: (target: PictureNavigationTarget) => void;
  hasNext?: boolean;
  hasPrevious?: boolean;
  sideBarOpen?: boolean;
  setSideBarOpen?: Dispatch<SetStateAction<boolean>>;
}

export const PictureViewContext = React.createContext<PictureViewContextFields>({});

const PictureView = ({
  pictureId,
  thumbnailUrl = '',
  initialThumbnail = false,
  flexValue = '0',
  hasPrevious,
  hasNext,
  openCallback,
  navigateCallback,
  initialParams,
}: {
  pictureId: string;
  thumbnailUrl?: string;
  initialThumbnail?: boolean;
  flexValue?: string;
  hasPrevious?: boolean;
  hasNext?: boolean;
  openCallback?: (open?: boolean) => void;
  navigateCallback?: (target: PictureNavigationTarget, params?: PictureViewContextFields) => void;
  initialParams?: PictureViewContextFields;
}) => {
  const history: History = useHistory();
  //   const [scrollPos, setScrollPos] = useState<number>(0);
  const [thumbnailMode, setThumbnailMode] = useState<boolean | undefined>(undefined);
  const [transitioning, setTransitioning] = useState<boolean>(false);

  const [maxHeight, setMaxHeight] = useState<string>('85vh');
  const [sideBarOpen, setSideBarOpen] = useState<boolean>(!!initialParams?.sideBarOpen);

  useEffect(() => {
    if (initialParams?.sideBarOpen !== undefined) {
      setSideBarOpen(!!initialParams.sideBarOpen);
    }
  }, [initialParams]);

  const calculateHeight = useCallback((container: HTMLElement) => {
    const posy = container.querySelector('.picture-infos')?.getBoundingClientRect().top;
    if (posy) {
      setMaxHeight(`${Math.max(posy, 256)}px`);
    } else {
      setMaxHeight(`85vh`);
    }
  }, []);

  const containerRef = useRef<any>();

  useEffect(() => {
    const container: HTMLDivElement = containerRef.current;
    const preventScroll = (event: WheelEvent) => {
      event.preventDefault();
      event.stopPropagation();
    };
    if (!thumbnailMode) {
      container.addEventListener('wheel', preventScroll);
    } else {
      container.removeEventListener('wheel', preventScroll);
    }

    return () => {
      container.removeEventListener('wheel', preventScroll);
    };
  }, [containerRef, thumbnailMode]);

  const [getPictureInfo, { data, loading, error }] = useGetPictureInfoLazyQuery({
    variables: {
      pictureId: pictureId,
    },
  });
  const picture: FlatPicture | undefined = useFlatQueryResponseData(data)?.picture;

  const setUpPicture = useCallback(
    (id: string) => {
      getPictureInfo({
        variables: {
          pictureId: id,
        },
      });
    },
    [getPictureInfo]
  );

  useEffect(() => {
    setThumbnailMode(initialThumbnail);
    if (!initialThumbnail) {
      setUpPicture(pictureId);
    }
  }, [initialThumbnail, setUpPicture, pictureId]);

  const pictureLink = useMemo(() => {
    if (picture?.media?.url) {
      return asApiPath(picture.media.url);
    } else if (thumbnailUrl) {
      return asApiPath(thumbnailUrl);
    } else {
      return '';
    }
  }, [picture, thumbnailUrl]);

  const openDetails = () => {
    window.setTimeout(() => {
      setTransitioning(true);
      setThumbnailMode(false);
    }, 0);
    window.history.pushState({}, '', `/picture/${pictureId}`);
    setSideBarOpen(false);
    zoomIntoPicture(pictureId, containerRef.current as HTMLDivElement).then(() => {
      setTransitioning(false);
      setSideBarOpen(true);
    });
    setUpPicture(pictureId);
    if (openCallback) {
      openCallback(true);
    }
  };

  const navigatePicture = useCallback(
    (target: PictureNavigationTarget) => {
      if (navigateCallback) {
        setTransitioning(false);
        nextImageAnimation(containerRef.current as HTMLDivElement, target).then(() => {
          setThumbnailMode(true);
          if (openCallback) {
            openCallback(false);
          }
          navigateCallback(target, { sideBarOpen });
        });
      }
    },
    [navigateCallback, openCallback, sideBarOpen]
  );

  useEffect(() => {
    if ((initialThumbnail || openCallback) && thumbnailMode === false) {
      const unblock = history.block(() => {
        setSideBarOpen(false);
        setTransitioning(true);
        zoomOutOfPicture(containerRef.current as HTMLDivElement).then(() => {
          setTransitioning(false);
          setThumbnailMode(true);
          if (openCallback) {
            openCallback(false);
          }
        });
      });
      return () => {
        unblock();
      };
    }
  }, [
    history,
    initialThumbnail,
    thumbnailMode,
    setUpPicture,
    pictureId,
    openCallback,
    navigatePicture,
  ]);

  return (
    <div
      className='picture-view-container'
      style={{
        flex: `${flexValue} 1 0`,
      }}
    >
      <PictureViewContext.Provider
        value={{
          navigatePicture,
          hasNext,
          hasPrevious,
          sideBarOpen,
          setSideBarOpen,
        }}
      >
        <div
          className={`picture-view${
            thumbnailMode || (thumbnailMode === undefined && initialThumbnail) ? ' thumbnail' : ''
          }${transitioning ? ' transitioning' : ''}`}
          ref={containerRef}
          onClick={thumbnailMode ? openDetails : () => {}}
        >
          <div className='picture-wrapper'>
            <div className='picture-container' style={{ maxHeight }}>
              <img src={pictureLink} alt={pictureLink} />
            </div>
            {thumbnailMode === false && !loading && !error && picture && (
              <PictureViewUI maxHeight={maxHeight} calledViaLink={openCallback === undefined} />
            )}
          </div>
          {thumbnailMode === false && !loading && !error && picture && (
            <PictureInfo
              picture={picture}
              pictureId={pictureId}
              calculateHeight={calculateHeight}
            />
          )}
        </div>
      </PictureViewContext.Provider>
    </div>
  );
};

export default PictureView;
