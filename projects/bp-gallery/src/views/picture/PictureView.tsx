import React, { useContext, useEffect, useRef, useState } from 'react';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { History, Location } from 'history';
import { Icon, IconButton } from '@mui/material';
import './PictureView.scss';
import PictureDetails from './PictureDetails';
import CommentsContainer from './comments/CommentsContainer';
import Picture from './Picture';
import { asApiPath, NavigationContext } from '../../App';
import { Comment, Description, useGetPictureInfoQuery } from '../../graphql/APIConnector';
import QueryErrorDisplay from '../../components/QueryErrorDisplay';
import Loading from '../../components/Loading';
import { NavigationElement } from '../../components/NavigationBar';

const DetailedPictureView = ({
  pictureId,
  onNextPicture,
  onPreviousPicture,
}: {
  pictureId: string;
  onNextPicture?: () => void;
  onPreviousPicture?: () => void;
}) => {
  const { t } = useTranslation();
  const [scrollPos, setScrollPos] = useState<number>(0);
  const containerRef = useRef<HTMLElement>();

  const MINIMUM_PICTURE_HEIGHT = 150;
  const MAXIMUM_PICTURE_HEIGHT = 0.65 * window.innerHeight;

  const pictureHeight = Math.min(
    Math.max(MAXIMUM_PICTURE_HEIGHT - scrollPos, MINIMUM_PICTURE_HEIGHT),
    MAXIMUM_PICTURE_HEIGHT
  );

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = 0;
    } else {
      setScrollPos(0);
    }
  }, [pictureId]);

  const setNavigationElements = useContext(NavigationContext);
  const scrollToElement = () => {
    if (!containerRef.current || !window.location.hash || window.location.hash === '') {
      return;
    }
    const targetElement = document.querySelector(window.location.hash);
    if (!targetElement) {
      return;
    }
    const elementPosition =
      window.location.hash === '#photo'
        ? 0
        : targetElement.getBoundingClientRect().y +
          containerRef.current.scrollTop -
          containerRef.current.getBoundingClientRect().y -
          MINIMUM_PICTURE_HEIGHT;
    containerRef.current.scroll({
      top: elementPosition,
      left: 0,
      behavior: 'smooth',
    });
  };

  useEffect(() => {
    const pictureLink = `/picture/${pictureId}`;
    const menuItems: NavigationElement[] = [
      {
        name: t('common.picture'),
        icon: 'photo',
        target: (previousLocation: Location) => {
          /**
           * It is sufficient to call scrollToElement here once and not in the other targets, because the base Location
           * (meaning '/picture') is the same, so all targets are checked once a navigation event is triggered.
           * This means that the scrolling will be executed regardless of the hash (#) value currently assinged to
           * the url. It is called here to reduce code duplication.
           */
          scrollToElement();
          return {
            pathname: pictureLink,
            hash: '#photo',
            state: { ...previousLocation.state, showBack: true },
          };
        },
        isActive: () => {
          return window.location.hash !== '#info' && window.location.hash !== '#comments';
        },
        replace: true,
      },
      {
        name: t('common.details'),
        icon: 'info',
        target: (previousLocation: Location) => ({
          pathname: pictureLink,
          hash: '#info',
          state: { ...previousLocation.state, showBack: true },
        }),
        isActive: () => {
          return window.location.hash === '#info';
        },
        replace: true,
      },
      {
        name: t('common.comments'),
        icon: 'comment',
        target: (previousLocation: Location) => ({
          pathname: pictureLink,
          hash: '#comments',
          state: { ...previousLocation.state, showBack: true },
        }),
        isActive: () => {
          return window.location.hash === '#comments';
        },
        replace: true,
      },
    ];
    setNavigationElements(menuItems);
  }, [setNavigationElements, t, pictureId]);

  const { data, loading, error } = useGetPictureInfoQuery({
    variables: {
      pictureId: pictureId,
    },
  });

  if (error) {
    return <QueryErrorDisplay error={error} />;
  } else if (loading) {
    return <Loading />;
  } else if (data?.picture) {
    return (
      <div className='picture-view'>
        <Picture url={data.picture.media?.url ?? ''} pictureHeight={pictureHeight} />
        <div className='parallax-container' style={{ top: `${pictureHeight}px` }}>
          <div className='picture-background' />
          <div className='title'>{data.picture.title?.text ?? ''}</div>
        </div>

        <PerfectScrollbar
          options={{ suppressScrollX: true, useBothWheelAxes: false }}
          onScrollY={container => {
            setScrollPos(container.scrollTop);
          }}
          containerRef={container => (containerRef.current = container)}
        >
          <div className='picture-navigation-buttons'>
            {onPreviousPicture && (
              <IconButton onClick={onPreviousPicture} size='large'>
                <Icon>fast_rewind</Icon>
              </IconButton>
            )}
            {onNextPicture && (
              <IconButton onClick={onNextPicture} size='large'>
                <Icon>fast_forward</Icon>
              </IconButton>
            )}
          </div>
          <div className='picture-info-container'>
            <PictureDetails descriptions={data.picture.descriptions as Description[]} />
            <CommentsContainer
              comments={data.picture.comments as Comment[]}
              pictureId={pictureId}
            />
          </div>
        </PerfectScrollbar>
      </div>
    );
  } else {
    return <div>{t('common.no-picture')}</div>;
  }
};

enum PictureNavigationTarget {
  NEXT,
  PREVIOUS,
}

export const getNextPictureId = (currentPictureId: string, pictureIds: string[]) => {
  const indexOfCurrentPictureId: number = pictureIds.indexOf(currentPictureId);
  return pictureIds[indexOfCurrentPictureId +1]
};

export const getPreviousPictureId = (currentPictureId: string, pictureIds: string[]): string => {
  const indexOfCurrentPictureId: number = pictureIds.indexOf(currentPictureId);
  return pictureIds[indexOfCurrentPictureId - 1] ?? pictureIds[pictureIds.length - 1];
};

const PictureView = ({
  pictureId,
  pictureIdsInContext,
  thumbnailUrl = '',
  thumbnailMode = false,
}: {
  pictureId: string;
  pictureIdsInContext?: string[];
  thumbnailUrl?: string;
  thumbnailMode?: boolean;
}) => {
  const history: History = useHistory();

  if (thumbnailMode) {
    return (
      <img
        src={asApiPath(thumbnailUrl)}
        alt={thumbnailUrl}
        onClick={() => {
          history.push(`/picture/${pictureId}`, { showBack: true, pictureIdsInContext });
        }}
      />
    );
  } else {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    const pictureIdsInContext: string[] | undefined = history?.location.state?.pictureIdsInContext;

    const showNewPicture = (target: PictureNavigationTarget) => {
      if (!pictureIdsInContext) {
        return;
      }

      let newPictureId: string = pictureId;
      switch (target) {
        case PictureNavigationTarget.NEXT:
          newPictureId = getNextPictureId(pictureId, pictureIdsInContext);
          break;
        case PictureNavigationTarget.PREVIOUS:
          newPictureId = getPreviousPictureId(pictureId, pictureIdsInContext);
          break;
        default:
          break;
      }

      history.replace(`/picture/${newPictureId}`, {
        showBack: true,
        pictureIdsInContext: pictureIdsInContext,
      });
    };

    return (
      <DetailedPictureView
        pictureId={pictureId}
        onNextPicture={
          pictureIdsInContext ? () => showNewPicture(PictureNavigationTarget.NEXT) : undefined
        }
        onPreviousPicture={
          pictureIdsInContext ? () => showNewPicture(PictureNavigationTarget.PREVIOUS) : undefined
        }
      />
    );
  }
};

export default PictureView;
