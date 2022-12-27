import { isFunction } from 'lodash';
import React, { MouseEvent, MouseEventHandler, useMemo, useRef } from 'react';
import { asApiPath } from '../../App';
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
  viewOnly,
  highQuality,
}: {
  picture: FlatPicture;
  onClick: MouseEventHandler<HTMLDivElement>;
  pictureOrigin?: PictureOrigin;
  adornments?: PicturePreviewAdornment[];
  viewOnly?: boolean;
  highQuality?: boolean;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const thumbnailUrl = useMemo((): string => {
    const defaultUrl =
      (picture.media?.formats?.small || picture.media?.formats?.thumbnail)?.url || '';
    return highQuality ? picture.media?.url ?? defaultUrl : defaultUrl;
  }, [picture, highQuality]);

  return (
    <div
      onClick={onClick}
      id={`picture-preview-for-${picture.id}`}
      className={`picture-preview ${viewOnly ? 'view-only' : ''}`}
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
    </div>
  );
};

export default PicturePreview;
