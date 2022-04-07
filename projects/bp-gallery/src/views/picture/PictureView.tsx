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
import { History, Transition } from 'history';
import { FlatPicture } from '../../graphql/additionalFlatTypes';
import PictureViewUI from './PictureViewUI';
import PictureSidebar from './PictureSidebar';
import { useSimplifiedQueryResponseData } from '../../graphql/queryUtils';
import { PictureNavigationTarget } from './PictureNavigationButtons';
import ZoomWrapper from './ZoomWrapper';
import usePrefetchPictureHook from './prefetch.hook';
import { getNextPictureId, getPreviousPictureId } from './helpers/next-prev-picture';

export interface PictureViewContextFields {
  navigatePicture?: (target: PictureNavigationTarget) => void;
  hasNext?: boolean;
  hasPrevious?: boolean;
  sideBarOpen?: boolean;
  setSideBarOpen?: Dispatch<SetStateAction<boolean>>;
}

export const PictureViewContext = React.createContext<PictureViewContextFields>({});

const PictureView = ({
  initialPictureId,
  siblingIds,
  onBack,
}: {
  initialPictureId: string;
  siblingIds?: string[];
  onBack?: (picid: string) => void;
}) => {
  const history: History = useHistory();

  const containerRef = useRef<HTMLDivElement>(null);

  const [pictureId, setPictureId] = useState<string>(initialPictureId);
  const [transitioning, setTransitioning] = useState<boolean>(false);
  const [sideBarOpen, setSideBarOpen] = useState<boolean>(false);

  const [hasPrevious, hasNext] = useMemo(() => {
    return [
      Boolean(getPreviousPictureId(pictureId, siblingIds)),
      Boolean(getNextPictureId(pictureId, siblingIds)),
    ];
  }, [pictureId, siblingIds]);

  // Api connection
  const [getPictureInfo, { data, loading, error }] = usePrefetchPictureHook(pictureId, siblingIds);
  const picture: FlatPicture | undefined = useSimplifiedQueryResponseData(data)?.picture;
  const pictureLink = picture?.media?.url ? asApiPath(picture.media.url) : '';

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

  useEffect(() => {
    setUpPicture(pictureId);
  }, [setUpPicture, pictureId]);

  // Call the previous or next picture
  const navigatePicture = useCallback(
    (target: PictureNavigationTarget) => {
      const targetId =
        target === PictureNavigationTarget.NEXT
          ? getNextPictureId(pictureId, siblingIds)
          : getPreviousPictureId(pictureId, siblingIds);
      if (targetId) {
        window.history.replaceState({}, '', `/picture/${targetId}`);
        setPictureId(targetId);
      }
    },
    [pictureId, siblingIds, setPictureId]
  );

  // Wrap all context information in this variable
  const contextValue: PictureViewContextFields = {
    navigatePicture,
    hasNext,
    hasPrevious,
    sideBarOpen,
    setSideBarOpen,
  };

  // Block navigation and handle yourself, i.e. block browser navigation and
  // just close picture if it was called from the picture grid
  useEffect(() => {
    const unblock = history.block((tx: Transition) => {
      setSideBarOpen(false);
      if (onBack) {
        onBack(pictureId);
      }
    });
    return () => {
      unblock();
    };
  }, [history, pictureId, navigatePicture, onBack]);

  return (
    <div className='picture-view-container'>
      <PictureViewContext.Provider value={contextValue}>
        <div className={`picture-view${transitioning ? ' transitioning' : ''}`} ref={containerRef}>
          <ZoomWrapper blockScroll={true}>
            <div className='picture-wrapper'>
              <div className='picture-container'>
                <img src={pictureLink} alt={pictureLink} />
              </div>
              {!loading && !error && picture && <PictureViewUI calledViaLink={!onBack} />}
            </div>
          </ZoomWrapper>
          <PictureSidebar loading={loading} error={error} picture={picture} />
        </div>
      </PictureViewContext.Provider>
    </div>
  );
};

export default PictureView;
