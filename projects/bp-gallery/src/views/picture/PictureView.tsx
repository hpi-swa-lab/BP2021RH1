import React, { useContext, useEffect, useMemo, useState } from 'react';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { History, Location } from 'history';
import { Icon, IconButton } from '@mui/material';
import './PictureView.scss';
import PictureDetails from './PictureDetails';
import CommentsContainer from './comments/CommentsContainer';
import Picture from './Picture';
import { apiBase, NavigationContext } from '../../App';
import {
  ComponentContentComment,
  Description,
  useGetPictureInfoQuery,
} from '../../graphql/APIConnector';
import QueryErrorDisplay from '../../components/QueryErrorDisplay';
import Loading from '../../components/Loading';

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
  const [scrollPos, setScrollPos] = useState<number>();
  const [pictureHeight, setPictureHeight] = useState<number>(0.65 * window.innerHeight);

  const parallaxPosition = useMemo(() => {
    return Math.max(window.innerHeight * 0.65 - (scrollPos ?? 0), pictureHeight);
  }, [scrollPos, pictureHeight]);

  const setNavigationElements = useContext(NavigationContext);

  useEffect(() => {
    const pictureLink = `/picture/${pictureId}`;
    const menuItems = [
      {
        name: t('common.picture'),
        icon: 'photo',
        target: (previousLocation: Location) => ({
          pathname: pictureLink,
          hash: '#photo',
          state: { ...previousLocation.state, showBack: true },
        }),
      },
      {
        name: t('common.details'),
        icon: 'info',
        target: (previousLocation: Location) => ({
          pathname: pictureLink,
          hash: '#info',
          state: { ...previousLocation.state, showBack: true },
        }),
      },
      {
        name: t('common.comments'),
        icon: 'comment',
        target: (previousLocation: Location) => ({
          pathname: pictureLink,
          hash: '#comments',
          state: { ...previousLocation.state, showBack: true },
        }),
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
        <Picture
          url={data.picture.media?.url ?? ''}
          scrollPos={scrollPos}
          onPictureHeightChange={setPictureHeight}
        />
        <div className='parallax-container' style={{ top: `${parallaxPosition}px` }}>
          <div className='picture-background' />
          <div className='title'>{data.picture.title?.text ?? ''}</div>
        </div>

        <PerfectScrollbar
          options={{ suppressScrollX: true, useBothWheelAxes: false }}
          onScrollY={container => {
            setScrollPos(container.scrollTop);
          }}
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
            <CommentsContainer comments={data.picture.Comment as ComponentContentComment[]} />
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
  return pictureIds.at(indexOfCurrentPictureId + 1) ?? pictureIds.at(0) ?? currentPictureId;
};

export const getPreviousPictureId = (currentPictureId: string, pictureIds: string[]): string => {
  const indexOfCurrentPictureId: number = pictureIds.indexOf(currentPictureId);
  return (
    pictureIds.at(indexOfCurrentPictureId - 1) ??
    pictureIds.at(pictureIds.length - 1) ??
    currentPictureId
  );
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
        src={`${apiBase}${thumbnailUrl}`}
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

      history.push(`/picture/${newPictureId}`, {
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
