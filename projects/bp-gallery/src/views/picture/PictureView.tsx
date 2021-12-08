import React, { useContext, useEffect, useMemo, useState } from 'react';
import './PictureView.scss';
import PictureDetails from './PictureDetails';
import CommentsContainer from './comments/CommentsContainer';
import Picture from './Picture';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { useTranslation } from 'react-i18next';
import { History } from 'history';
import { useHistory } from 'react-router-dom';
import { apiBase, NavigationContext } from '../../App';
import {
  ComponentContentComment,
  Description,
  useGetPictureInfoQuery,
} from '../../graphql/APIConnector';
import QueryErrorDisplay from '../../components/QueryErrorDisplay';
import Loading from '../../components/Loading';

const DetailedPictureView = ({ pictureId }: { pictureId: string }) => {
  const { t } = useTranslation();
  const [scrollPos, setScrollPos] = useState<number>();
  const [pictureHeight, setPictureHeight] = useState<number>(0.65 * window.innerHeight);

  const parallaxPosition = useMemo(() => {
    return Math.max(window.innerHeight * 0.65 - (scrollPos ?? 0), pictureHeight);
  }, [scrollPos, pictureHeight]);

  const setNavigationElements = useContext(NavigationContext);

  useEffect(() => {
    const menuItems = [
      {
        name: t('common.picture'),
        icon: 'photo',
        target: `/picture/${pictureId}#photo`,
      },
      {
        name: t('common.details'),
        icon: 'info',
        target: `/picture/${pictureId}#info`,
      },
      {
        name: t('common.comments'),
        icon: 'comment',
        target: `/picture/${pictureId}#comments`,
      },
    ];
    console.log('Calling... Picture');
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

const PictureView = ({
  pictureId,
  thumbnailUrl = '',
  thumbnailMode = false,
}: {
  pictureId: string;
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
          history.push(`/picture/${pictureId}`, { showBack: true });
        }}
      />
    );
  } else {
    return <DetailedPictureView pictureId={pictureId} />;
  }
};

export default PictureView;
