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
import { nextImageAnimation, zoomIntoPicture, zoomOutOfPicture } from './picture-animation.helpers';
import PictureViewUI from './components/PictureViewUI';
import PictureInfo from './components/PictureInfo';
import { useFlatQueryResponseData } from '../../graphql/queryUtils';
import { PictureNavigationTarget } from './components/PictureNavigationButtons';
import ZoomWrapper from './ZoomWrapper';

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
  isInitialThumbnail = false,
  flexValue = '0',
  hasPrevious = false,
  hasNext = false,
  openCallback,
  navigateCallback,
  initialParams,
}: {
  pictureId: string;
  thumbnailUrl?: string;
  isInitialThumbnail?: boolean;
  flexValue?: string;
  hasPrevious?: boolean;
  hasNext?: boolean;
  openCallback?: (open?: boolean) => void;
  navigateCallback?: (target: PictureNavigationTarget, params?: PictureViewContextFields) => void;
  initialParams?: PictureViewContextFields;
}) => {
  const history: History = useHistory();

  const containerRef = useRef<HTMLDivElement>(null);

  const [thumbnailMode, setThumbnailMode] = useState<boolean | undefined>(undefined);
  const [transitioning, setTransitioning] = useState<boolean>(false);
  const [sideBarOpen, setSideBarOpen] = useState<boolean>(!!initialParams?.sideBarOpen);

  const shouldBeThumbnail = thumbnailMode || (thumbnailMode === undefined && isInitialThumbnail);

  // Api connection
  const [getPictureInfo, { data, loading, error }] = useGetPictureInfoLazyQuery({
    variables: {
      pictureId: pictureId,
    },
  });
  const picture: FlatPicture | undefined = useFlatQueryResponseData(data)?.picture;

  // Switch between using the thumbnail url and the "loaded" picture's url
  const pictureLink = useMemo(() => {
    if (picture?.media?.url) {
      return asApiPath(picture.media.url);
    } else if (thumbnailUrl) {
      return asApiPath(thumbnailUrl);
    } else {
      return '';
    }
  }, [picture, thumbnailUrl]);

  // Execute lazy query (e.g. when triggering the picture from the picture grid)
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

  // Call the previous or next picture
  const navigatePicture = useCallback(
    (target: PictureNavigationTarget) => {
      if (navigateCallback) {
        setTransitioning(false);
        nextImageAnimation(containerRef.current as HTMLDivElement, target).then(() => {
          if (openCallback) {
            openCallback(false);
          }
          navigateCallback(target, { sideBarOpen });
          setThumbnailMode(true);
        });
      }
    },
    [navigateCallback, openCallback, sideBarOpen]
  );

  // Open the "detail" view of the image using an external animation
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

  // Wrap all context information in this variable
  const contextValue: PictureViewContextFields = {
    navigatePicture,
    hasNext,
    hasPrevious,
    sideBarOpen,
    setSideBarOpen,
  };

  // Open Sidebar if initialParams dictate it
  useEffect(() => {
    if (initialParams?.sideBarOpen !== undefined) {
      setSideBarOpen(!!initialParams.sideBarOpen);
    }
  }, [initialParams]);

  // Apply initial thumbnail preference to state variable
  useEffect(() => {
    setThumbnailMode(isInitialThumbnail);
    if (!isInitialThumbnail) {
      setUpPicture(pictureId);
    }
  }, [isInitialThumbnail, setUpPicture, pictureId]);

  // Block navigation and handle yourself, i.e. block browser navigation and
  // just close picture if it was called from the picture grid
  useEffect(() => {
    if ((isInitialThumbnail || openCallback) && thumbnailMode === false) {
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
    isInitialThumbnail,
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
      <PictureViewContext.Provider value={contextValue}>
        <div
          className={`picture-view${shouldBeThumbnail ? ' thumbnail' : ''}${
            transitioning ? ' transitioning' : ''
          }`}
          ref={containerRef}
          onClick={thumbnailMode ? openDetails : undefined}
        >
          <ZoomWrapper blockScroll={!thumbnailMode}>
            <div className='picture-wrapper'>
              <div className='picture-container'>
                <img src={pictureLink} alt={pictureLink} />
              </div>
              {thumbnailMode === false && !loading && !error && picture && (
                <PictureViewUI calledViaLink={openCallback === undefined} />
              )}
            </div>
          </ZoomWrapper>
          {thumbnailMode === false && (
            <PictureInfo loading={loading} error={error} picture={picture} />
          )}
        </div>
      </PictureViewContext.Provider>
    </div>
  );
};

export default PictureView;
