import { isFunction } from 'lodash';
import { MouseEvent, MouseEventHandler, useRef, useState } from 'react';
import { PictureOrigin, asUploadPath } from '../../../helpers/app-helpers';
import { useStats } from '../../../hooks/context-hooks';
import { FlatPicture } from '../../../types/additionalFlatTypes';
import './PicturePreview.scss';
import PictureStats from './PictureStats';

export interface PicturePreviewAdornment {
  position: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
  onClick: (picture: FlatPicture, event: MouseEvent<HTMLElement>) => void;
  icon: ((picture: FlatPicture) => JSX.Element) | JSX.Element;
  title?: string;
  onlyShowOnHover?: boolean;
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
  const containerRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);
  const showStats = useStats();

  return (
    <div
      className='preview-container'
      onMouseOver={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
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
          className={
            showStats ? `transition-filter duration-200 ${hovered ? 'brightness-75' : ''}` : ''
          }
          src={asUploadPath(picture.media, { highQuality: highQuality ?? false, pictureOrigin })}
        />
        <div className='adornments'>
          {adornments?.map((adornment, index) => (
            <div
              className={`adornment ${adornment.position} ${
                adornment.onlyShowOnHover
                  ? `transition-opacity ${hovered ? 'opacity-100' : 'opacity-0'}`
                  : ''
              }`}
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
        <PictureStats picture={picture} hovered={hovered} />
      </div>
    </div>
  );
};

export default PicturePreview;
