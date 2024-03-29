import { History } from 'history';
import {
  createContext,
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useHistory } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { useGetPictureInfoQuery } from '../../../graphql/APIConnector';
import { useSimplifiedQueryResponseData } from '../../../graphql/queryUtils';
import { asUploadPath } from '../../../helpers/app-helpers';
import { replaceHistoryWithoutRouter } from '../../../helpers/history';
import { useBlockImageContextMenuByPictureId } from '../../../hooks/block-image-context-menu.hook';
import { useMouseIsIdle } from '../../../hooks/mouse-position.hook';
import usePrefetchPictureHook from '../../../hooks/prefetch.hook';
import usePresentationChannel from '../../../hooks/presentation-channel.hook';
import { FlatPicture } from '../../../types/additionalFlatTypes';
import { FaceTaggingProvider } from '../../provider/FaceTaggingProvider';
import { FaceTags } from './face-tagging/FaceTags';
import { getNextPictureId, getPreviousPictureId } from './helpers/next-prev-picture';
import { PictureNavigationTarget } from './overlay/PictureNavigationButtons';
import PictureViewUI from './overlay/PictureViewUI';
import ZoomWrapper from './overlay/ZoomWrapper';
import './PictureView.scss';
import PictureSidebar from './sidebar/PictureSidebar';

export interface PictureViewContextFields {
  navigatePicture?: (target: PictureNavigationTarget) => void;
  hasNext?: boolean;
  hasPrevious?: boolean;
  sideBarOpen?: boolean;
  noDistractionMode?: boolean;
  setSideBarOpen?: Dispatch<SetStateAction<boolean>>;
  calledViaLink?: boolean;
  img: HTMLImageElement | null;
}

export const PictureViewContext = createContext<PictureViewContextFields>({ img: null });

// Used for the sidebar (in px) --> same as in shared.scss
const MOBILE_BREAKPOINT = 750;

const PictureView = ({
  initialPictureId,
  siblingIds,
  onBack,
  fetchMore,
}: {
  initialPictureId: string;
  siblingIds?: string[];
  onBack?: (picid: string) => void;
  fetchMore?: (currentPictureId: string) => void;
}) => {
  const history: History = useHistory();

  const containerRef = useRef<HTMLDivElement>(null);

  const [pictureId, setPictureId] = useState<string>(initialPictureId);
  const [sideBarOpen, setSideBarOpen] = useState<boolean>(false);

  useEffect(() => {
    if (window.innerWidth > MOBILE_BREAKPOINT) {
      setSideBarOpen(true);
    }
  }, []);

  useEffect(() => {
    if (fetchMore && siblingIds && siblingIds.indexOf(pictureId) === siblingIds.length - 1) {
      fetchMore(pictureId);
    }
  }, [fetchMore, siblingIds, pictureId]);

  const search = window.location.search;
  const [sessionId, isPresentationMode] = useMemo((): [string, boolean] => {
    const params = new URLSearchParams(search);
    return [
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      params.get('presentation') ?? uuidv4(),
      !!params.get('presentation'),
    ];
  }, [search]);

  const [hasPrevious, hasNext] = useMemo(() => {
    return [
      Boolean(getPreviousPictureId(pictureId, siblingIds)),
      Boolean(getNextPictureId(pictureId, siblingIds)),
    ];
  }, [pictureId, siblingIds]);

  // Api connection
  usePrefetchPictureHook(pictureId, siblingIds);

  const { data, loading, error } = useGetPictureInfoQuery({ variables: { pictureId } });
  const picture: FlatPicture | undefined = useSimplifiedQueryResponseData(data)?.picture;
  const pictureLink = asUploadPath(picture?.media);

  const onNavigateMessage = useCallback((pictureId: string) => {
    replaceHistoryWithoutRouter(`/picture/${pictureId}${window.location.search}`);
    setPictureId(pictureId);
  }, []);

  const navigateToPicture = usePresentationChannel(sessionId, onNavigateMessage);

  // Call the previous or next picture
  const navigatePicture = useCallback(
    (target: PictureNavigationTarget) => {
      const targetId =
        target === PictureNavigationTarget.NEXT
          ? getNextPictureId(pictureId, siblingIds)
          : getPreviousPictureId(pictureId, siblingIds);
      if (targetId) {
        navigateToPicture(targetId);
      }
    },
    [pictureId, siblingIds, navigateToPicture]
  );

  const [img, setImg] = useState<HTMLImageElement | null>(null);

  const minMouseIdleMillisecondsForNoDistractionMode = 3000;
  const mouseIsIdle = useMouseIsIdle(minMouseIdleMillisecondsForNoDistractionMode);
  const noDistractionMode = !sideBarOpen && mouseIsIdle;

  // Wrap all context information in this variable
  const contextValue: PictureViewContextFields = {
    navigatePicture,
    hasNext,
    hasPrevious,
    sideBarOpen,
    noDistractionMode,
    setSideBarOpen,
    calledViaLink: !onBack,
    img,
  };

  // Block navigation and handle yourself, i.e. block browser navigation and
  // just close picture if it was called from the picture grid
  useEffect(() => {
    const unblock = history.block(() => {
      setSideBarOpen(false);
      if (onBack) {
        onBack(pictureId);
      }
    });
    return () => {
      unblock();
    };
  }, [history, pictureId, onBack]);

  const onImageContextMenu = useBlockImageContextMenuByPictureId(pictureId);

  return (
    <div className={`picture-view-container ${noDistractionMode ? 'cursor-none' : ''}`}>
      <PictureViewContext.Provider value={contextValue}>
        <FaceTaggingProvider pictureId={pictureId}>
          <div className={`picture-view`} ref={containerRef}>
            <ZoomWrapper blockScroll={true} pictureId={picture?.id ?? ''}>
              <div className='picture-wrapper w-full h-full'>
                <div className='picture-container w-full h-full'>
                  <div className='relative w-full h-full flex justify-center align-center'>
                    <img
                      className='max-w-full max-h-full object-contain picture'
                      ref={setImg}
                      src={pictureLink}
                      alt={pictureLink}
                      onContextMenu={onImageContextMenu}
                    />
                    <FaceTags />
                  </div>
                </div>
                {!isPresentationMode && !loading && !error && picture && (
                  <PictureViewUI
                    calledViaLink={!onBack}
                    pictureId={picture.id}
                    sessionId={sessionId}
                  />
                )}
              </div>
            </ZoomWrapper>
            {!isPresentationMode && (
              <PictureSidebar loading={loading} error={error} picture={picture} />
            )}
          </div>
        </FaceTaggingProvider>
      </PictureViewContext.Provider>
    </div>
  );
};

export default PictureView;
