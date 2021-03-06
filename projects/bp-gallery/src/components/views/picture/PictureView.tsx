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
import { FlatPicture } from '../../../types/additionalFlatTypes';
import PictureViewUI from './overlay/PictureViewUI';
import PictureSidebar from './sidebar/PictureSidebar';
import { useSimplifiedQueryResponseData } from '../../../graphql/queryUtils';
import { PictureNavigationTarget } from './overlay/PictureNavigationButtons';
import ZoomWrapper from './overlay/ZoomWrapper';
import usePrefetchPictureHook from '../../../hooks/prefetch.hook';
import { getNextPictureId, getPreviousPictureId } from './helpers/next-prev-picture';
import usePresentationChannel from '../../../hooks/presentation-channel.hook';
import { v4 as uuidv4 } from 'uuid';
import { AuthRole, useAuth } from '../../provider/AuthProvider';
import { useGetPictureInfoQuery } from '../../../graphql/APIConnector';

export interface PictureViewContextFields {
  navigatePicture?: (target: PictureNavigationTarget) => void;
  hasNext?: boolean;
  hasPrevious?: boolean;
  sideBarOpen?: boolean;
  setSideBarOpen?: Dispatch<SetStateAction<boolean>>;
  calledViaLink?: boolean;
}

export const PictureViewContext = React.createContext<PictureViewContextFields>({});

// Used for the sidebar (in px) --> same as in shared.scss
const MOBILE_BREAKPOINT = 750;

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
  const { role } = useAuth();

  const [pictureId, setPictureId] = useState<string>(initialPictureId);
  const [sideBarOpen, setSideBarOpen] = useState<boolean>(false);

  // Open the sidebar per default if logged in as a curators
  useEffect(() => {
    setSideBarOpen(role >= AuthRole.CURATOR || window.innerWidth > MOBILE_BREAKPOINT);
  }, [role]);

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
  const pictureLink = picture?.media?.url
    ? asApiPath(`${picture.media.url}?updatedAt=${picture.media.updatedAt as string}`)
    : '';

  const onNavigateMessage = useCallback((pictureId: string) => {
    window.history.replaceState({}, '', `/picture/${pictureId}${window.location.search}`);
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

  // Wrap all context information in this variable
  const contextValue: PictureViewContextFields = {
    navigatePicture,
    hasNext,
    hasPrevious,
    sideBarOpen,
    setSideBarOpen,
    calledViaLink: !onBack,
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

  return (
    <div className='picture-view-container'>
      <PictureViewContext.Provider value={contextValue}>
        <div className={`picture-view`} ref={containerRef}>
          <ZoomWrapper blockScroll={true} pictureId={picture?.id ?? ''}>
            <div className='picture-wrapper'>
              <div className='picture-container'>
                <img src={pictureLink} alt={pictureLink} />
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
      </PictureViewContext.Provider>
    </div>
  );
};

export default PictureView;
