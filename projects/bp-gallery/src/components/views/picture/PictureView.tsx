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
  hasNextInSequence?: boolean;
  hasPreviousInSequence?: boolean;
  sideBarOpen?: boolean;
  noDistractionMode?: boolean;
  setSideBarOpen?: Dispatch<SetStateAction<boolean>>;
  calledViaLink?: boolean;
  img: HTMLImageElement | null;
}

export const PictureViewContext = createContext<PictureViewContextFields>({ img: null });

// Used for the sidebar (in px) --> same as in shared.scss
const MOBILE_BREAKPOINT = 750;

export type PictureIds = {
  pictureInSiblingsId: string;
  pictureInSequenceId: string;
};

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

  const [pictureInSiblingsId, setPictureInSiblingsId] = useState<string>(initialPictureId);
  const [pictureInSequenceId, setPictureInSequenceId] = useState<string>(initialPictureId);

  const [sideBarOpen, setSideBarOpen] = useState<boolean>(false);

  useEffect(() => {
    if (window.innerWidth > MOBILE_BREAKPOINT) {
      setSideBarOpen(true);
    }
  }, []);

  useEffect(() => {
    if (
      fetchMore &&
      siblingIds &&
      siblingIds.indexOf(pictureInSiblingsId) === siblingIds.length - 1
    ) {
      fetchMore(pictureInSiblingsId);
    }
  }, [fetchMore, siblingIds, pictureInSiblingsId]);

  const search = window.location.search;
  const [sessionId, isPresentationMode] = useMemo((): [string, boolean] => {
    const params = new URLSearchParams(search);
    return [
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      params.get('presentation') ?? uuidv4(),
      !!params.get('presentation'),
    ];
  }, [search]);

  const { data, loading, error } = useGetPictureInfoQuery({
    variables: { pictureId: pictureInSequenceId },
  });
  const picture: FlatPicture | undefined = useSimplifiedQueryResponseData(data)?.picture;
  const pictureLink = asUploadPath(picture?.media);
  const pictureSequenceIds = useMemo(
    () => picture?.picture_sequence?.pictures?.map(picture => picture.id),
    [picture]
  );

  usePrefetchPictureHook(
    { pictureInSiblingsId, pictureInSequenceId },
    siblingIds,
    pictureSequenceIds
  );

  const [hasPrevious, hasNext, hasPreviousInSequence, hasNextInSequence] = useMemo(
    () => [
      Boolean(getPreviousPictureId(pictureInSiblingsId, siblingIds)),
      Boolean(getNextPictureId(pictureInSiblingsId, siblingIds)),
      Boolean(getPreviousPictureId(pictureInSequenceId, pictureSequenceIds)),
      Boolean(getNextPictureId(pictureInSequenceId, pictureSequenceIds)),
    ],
    [pictureInSequenceId, pictureInSiblingsId, pictureSequenceIds, siblingIds]
  );

  const onNavigateMessage = useCallback(
    ({ pictureInSiblingsId, pictureInSequenceId }: PictureIds) => {
      replaceHistoryWithoutRouter(`/picture/${pictureInSequenceId}${window.location.search}`);
      setPictureInSiblingsId(pictureInSiblingsId);
      setPictureInSequenceId(pictureInSequenceId);
    },
    []
  );

  const navigateToPicture = usePresentationChannel(sessionId, onNavigateMessage);

  // Call the previous or next picture
  const navigatePicture = useCallback(
    (target: PictureNavigationTarget) => {
      const targetIds: Partial<PictureIds> = {
        pictureInSequenceId,
        pictureInSiblingsId,
      };
      switch (target) {
        case PictureNavigationTarget.NEXT:
          targetIds.pictureInSiblingsId = getNextPictureId(pictureInSiblingsId, siblingIds);
          break;
        case PictureNavigationTarget.PREVIOUS:
          targetIds.pictureInSiblingsId = getPreviousPictureId(pictureInSiblingsId, siblingIds);
          break;
        case PictureNavigationTarget.NEXT_IN_SEQUENCE:
          targetIds.pictureInSequenceId = getNextPictureId(pictureInSequenceId, pictureSequenceIds);
          break;
        case PictureNavigationTarget.PREVIOUS_IN_SEQUENCE:
          targetIds.pictureInSequenceId = getPreviousPictureId(
            pictureInSequenceId,
            pictureSequenceIds
          );
          break;
      }
      if (targetIds.pictureInSiblingsId && targetIds.pictureInSequenceId) {
        if (targetIds.pictureInSiblingsId !== pictureInSiblingsId) {
          targetIds.pictureInSequenceId = targetIds.pictureInSiblingsId;
        }
        navigateToPicture(targetIds as PictureIds);
      }
    },
    [pictureInSequenceId, pictureInSiblingsId, siblingIds, pictureSequenceIds, navigateToPicture]
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
    hasNextInSequence,
    hasPreviousInSequence,
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
        onBack(pictureInSiblingsId);
      }
    });
    return () => {
      unblock();
    };
  }, [history, pictureInSiblingsId, onBack]);

  const onImageContextMenu = useBlockImageContextMenuByPictureId(pictureInSequenceId);

  return (
    <div className={`picture-view-container ${noDistractionMode ? 'cursor-none' : ''}`}>
      <PictureViewContext.Provider value={contextValue}>
        <FaceTaggingProvider pictureId={pictureInSequenceId}>
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
