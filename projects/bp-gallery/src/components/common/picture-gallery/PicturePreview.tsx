import { QuestionAnswer, ThumbUpAlt } from '@mui/icons-material';
import { isFunction } from 'lodash';
import { MouseEvent, MouseEventHandler, useMemo, useRef, useState } from 'react';
import { asApiPath } from '../../../helpers/app-helpers';
import { FlatPicture } from '../../../types/additionalFlatTypes';
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
  const [isUnder, setIsUnder] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  const thumbnailUrl = useMemo((): string => {
    const defaultUrl =
      (picture.media?.formats?.small || picture.media?.formats?.thumbnail)?.url || '';
    return highQuality ? picture.media?.url ?? defaultUrl : defaultUrl;
  }, [picture, highQuality]);
  console.log(showStatistics);

  return (
    <div
      onMouseOver={() => setShowStatistics(true)}
      onMouseLeave={() => setShowStatistics(false)}
      onClick={onClick}
      id={`picture-preview-for-${picture.id}`}
      className={`picture-preview ${allowClicks ? 'allow-clicks' : ''}`}
      ref={containerRef}
      style={{
        flex: `${String((picture.media?.width ?? 0) / (picture.media?.height ?? 1))} 1 0`,
      }}
    >
      {/* https://stackoverflow.com/questions/728616/disable-cache-for-some-images */}
      <img
        src={
          pictureOrigin === PictureOrigin.REMOTE
            ? asApiPath(
                `/${thumbnailUrl}?updatedAt=${(picture.media?.updatedAt ?? 'unknown') as string}`
              )
            : thumbnailUrl
        }
      />
      {showStatistics && !isUnder && (
        <div className='absolute flex justify-center w-full bottom-0 z-0 text-white opacity-70'>
          <div className='items-center flex gap-2'>
            <div className='items-center flex'>
              <ThumbUpAlt />
              {picture.likes ?? 0}
            </div>
            <div className='items-center flex'>
              <QuestionAnswer />
              {picture.comments?.length}
            </div>
          </div>
        </div>
      )}
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
      {isUnder && (
        <div className='flex justify-center w-full text-[rgb (34,34,34)] font-medium text-lg'>
          <div className='items-center flex gap-2'>
            <div className='items-center flex'>
              <ThumbUpAlt />
              {picture.likes ?? 0}
            </div>
            <div className='items-center flex'>
              <QuestionAnswer />
              {picture.comments?.length ?? 0}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PicturePreview;
