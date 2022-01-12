import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import './PictureView.scss';
import { asApiPath } from '../../App';
import { useHistory } from 'react-router-dom';
import { History } from 'history';
import { useGetPictureInfoLazyQuery } from '../../graphql/APIConnector';
import { FlatPicture } from '../../graphql/additionalFlatTypes';
import { nextImageAnimation, zoomIntoPicture, zoomOutOfPicture } from './picture.helpers';
import PictureViewUI, { PictureNavigationTarget } from './PictureViewUI';
import { useFlatQueryResponseData } from '../../graphql/queryUtils';

const PictureView = ({
  pictureId,
  thumbnailUrl = '',
  initialThumbnail = false,
  flexValue = '0',
  hasPrevious,
  hasNext,
  openCallback,
  navigateCallback,
}: {
  pictureId: string;
  thumbnailUrl?: string;
  initialThumbnail?: boolean;
  flexValue?: string;
  hasPrevious?: boolean;
  hasNext?: boolean;
  openCallback?: (open?: boolean) => void;
  navigateCallback?: (target: PictureNavigationTarget) => void;
}) => {
  const history: History = useHistory();
  //   const [scrollPos, setScrollPos] = useState<number>(0);
  const [thumbnailMode, setThumbnailMode] = useState<boolean | undefined>(undefined);
  const [transitioning, setTransitioning] = useState<boolean>(false);

  const [smallRect, setSmallRect] = useState<DOMRect | undefined>(undefined);

  const [maxHeight, setMaxHeight] = useState<string>('100%');

  const calculateHeight = useCallback((container: HTMLElement) => {
    const height = container.parentElement?.getBoundingClientRect().height;
    if (height) {
      setMaxHeight(`calc(100% - ${height}px)`);
    } else {
      setMaxHeight(`100%`);
    }
  }, []);

  const containerRef = useRef<any>();

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
    const sRect = (containerRef.current as HTMLDivElement).getBoundingClientRect();
    setSmallRect(sRect);
    window.setTimeout(() => {
      setTransitioning(true);
      setThumbnailMode(false);
    }, 0);
    window.history.pushState({}, '', `/picture/${pictureId}`);
    zoomIntoPicture(pictureId, containerRef.current as HTMLDivElement, sRect).then(() => {
      setTransitioning(false);
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
          navigateCallback(target);
        });
      }
    },
    [navigateCallback, openCallback]
  );

  useEffect(() => {
    if ((initialThumbnail || openCallback) && thumbnailMode === false) {
      const unblock = history.block(() => {
        setTransitioning(true);
        zoomOutOfPicture(containerRef.current as HTMLDivElement, smallRect).then(() => {
          setTransitioning(false);
          setThumbnailMode(true);
          if (openCallback) {
            openCallback(false);
          }
        });
      });

      const navigateKeyboardAction = (event: KeyboardEvent) => {
        if (event.key === 'ArrowRight') {
          navigatePicture(PictureNavigationTarget.NEXT);
        } else if (event.key === 'ArrowLeft') {
          navigatePicture(PictureNavigationTarget.PREVIOUS);
        }
      };
      window.addEventListener('keyup', navigateKeyboardAction);
      return () => {
        window.removeEventListener('keyup', navigateKeyboardAction);
        unblock();
      };
    }
    if (thumbnailMode === undefined && containerRef.current) {
      const sRect = (containerRef.current as HTMLDivElement).getBoundingClientRect();
      setSmallRect(sRect);
    }
  }, [
    history,
    initialThumbnail,
    smallRect,
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
      <div
        className={`picture-view${
          thumbnailMode || (thumbnailMode === undefined && initialThumbnail) ? ' thumbnail' : ''
        }${transitioning ? ' transitioning' : ''}`}
        ref={containerRef}
        onClick={thumbnailMode ? openDetails : () => {}}
      >
        {thumbnailMode === false && (
          <div className='background-container'>
            <img src={pictureLink} alt={pictureLink} className='blur-background' />
          </div>
        )}
        <div className='picture-container' style={{ maxHeight }}>
          <img src={pictureLink} alt={pictureLink} />
        </div>
        {thumbnailMode === false && !loading && !error && data?.picture && (
          <PictureViewUI
            picture={data.picture as FlatPicture}
            hasPrevious={hasPrevious}
            hasNext={hasNext}
            navigateCallback={navigatePicture}
            calculateHeight={calculateHeight}
          />
        )}
      </div>
    </div>
  );
};

export default PictureView;
