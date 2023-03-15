import { QuestionAnswer, ThumbUpAlt, ThumbUpAltOutlined } from '@mui/icons-material';
import { isFunction } from 'lodash';
import { MouseEvent, MouseEventHandler, useMemo, useRef, useState } from 'react';
import { asApiPath } from '../../../helpers/app-helpers';
import { FlatPicture } from '../../../types/additionalFlatTypes';
import useLike from '../../views/picture/sidebar/like-hooks';
import './PicturePreview.scss';

export interface PicturePreviewAdornment {
  position: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
  onClick: (picture: FlatPicture, event: MouseEvent<HTMLElement>) => void;
  icon: ((picture: FlatPicture) => JSX.Element) | JSX.Element;
  title?: string;
}

export enum PictureOrigin {
  LOCAL,
  REMOTE,
}

const PicturePreview = ({
  picture,
  onClick,
  pictureOrigin = PictureOrigin.REMOTE,
  adornments,
  allowClicks = true,
  highQuality,
}: {
  picture: FlatPicture;
  onClick: MouseEventHandler<HTMLDivElement>;
  pictureOrigin?: PictureOrigin;
  adornments?: PicturePreviewAdornment[];
  allowClicks?: boolean;
  highQuality?: boolean;
}) => {
  const [showStatistics, setShowStatistics] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const thumbnailUrl = useMemo((): string => {
    const defaultUrl =
      (picture.media?.formats?.small || picture.media?.formats?.thumbnail)?.url || '';
    return highQuality ? picture.media?.url ?? defaultUrl : defaultUrl;
  }, [picture, highQuality]);

  const { likeCount, like, isLiked } = useLike(picture.id, picture.likes ?? 0);
  return (
    <div
      onMouseOver={() => setShowStatistics(true)}
      onMouseLeave={() => setShowStatistics(false)}
      onClick={onClick}
      ref={containerRef}
      style={{
        flex: `${String((picture.media?.width ?? 0) / (picture.media?.height ?? 1))} 1 0`,
      }}
    >
      <div
        className={`picture-preview ${allowClicks ? 'allow-clicks' : ''}`}
        id={`picture-preview-for-${picture.id}`}
      >
        {/* https://stackoverflow.com/questions/728616/disable-cache-for-some-images */}
        <img
          className={`${showStatistics ? 'brightness-75' : ''}`}
          src={
            pictureOrigin === PictureOrigin.REMOTE
              ? asApiPath(
                  `/${thumbnailUrl}?updatedAt=${(picture.media?.updatedAt ?? 'unknown') as string}`
                )
              : thumbnailUrl
          }
        />

        <div className='adornments'>
          {adornments?.map((adornment, index) => (
            <div
              className={`adornment ${adornment.position}`}
              key={index}
              title={adornment.title}
              onClick={event => {
                event.preventDefault();
                event.stopPropagation();
                adornment.onClick(picture, event);
              }}
            >
              {isFunction(adornment.icon) ? <>{adornment.icon(picture)}</> : <>{adornment.icon}</>}
            </div>
          ))}
        </div>
        <div className='absolute flex w-full justify-end bottom-0 transparent right-0 text-white brightness-100'>
          <div className={`h-20 w-full bg-gradient-to-t from-black `}></div>
          <div
            className={`absolute bottom-0 right-0 items-center flex gap-2 transparent mb-1 mr-2 transition-all ${
              showStatistics ? 'text-xl' : 'text-base'
            }`}
          >
            <div
              className='items-center flex'
              onClick={event => {
                event.stopPropagation();
                like(isLiked);
              }}
            >
              {isLiked ? (
                <ThumbUpAlt fontSize='inherit' className='text-blue-400' />
              ) : (
                <ThumbUpAltOutlined fontSize='inherit' />
              )}
              &nbsp;
              {likeCount}
            </div>

            <div className='items-center flex'>
              <QuestionAnswer fontSize='inherit' />
              &nbsp;
              {picture.comments?.length ?? 0}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PicturePreview;
