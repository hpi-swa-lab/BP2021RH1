import { isFunction } from 'lodash';
import { FunctionComponent, MouseEvent, MouseEventHandler, useMemo, useRef, useState } from 'react';
import { asApiPath } from '../../../helpers/app-helpers';
import { useStats } from '../../../hooks/context-hooks';
import { FlatPicture } from '../../../types/additionalFlatTypes';
import './PicturePreview.scss';
import PictureStats from './PictureStats';

export enum PictureOrigin {
  LOCAL,
  REMOTE,
}

export type PicturePreviewAdornment =
  | DefaultPicturePreviewAdornmentConfig
  // any, because sadly, the type is invariant in it's parameter (see below),
  // so neither unknown nor never works here (and TypeScript doesn't
  // have existential types yet: https://github.com/Microsoft/TypeScript/issues/14466)
  | CustomPicturePreviewAdornmentConfig<any>;

export type CustomPicturePreviewAdornmentConfig<T> = {
  // this type is invariant in T, since
  // - `component` forces it to be contravariant in T
  // - `extraProps` forces it to be covariant in T
  component: CustomPicturePreviewAdornmentComponent<T>;
  extraProps: T;
};

export type CustomPicturePreviewAdornmentComponent<T> = FunctionComponent<{
  context: PicturePreviewAdornmentContext;
  extraProps: T;
}>;

export interface PicturePreviewAdornmentContext {
  picture: FlatPicture;
  hovered: boolean;
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

  const thumbnailUrl = useMemo((): string => {
    const defaultUrl =
      (picture.media?.formats?.small || picture.media?.formats?.thumbnail || picture.media)?.url ||
      '';
    return highQuality ? picture.media?.url ?? defaultUrl : defaultUrl;
  }, [picture, highQuality]);

  const adornmentContext: PicturePreviewAdornmentContext = useMemo(
    () => ({
      picture,
      hovered,
    }),
    [picture, hovered]
  );

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
          src={
            pictureOrigin === PictureOrigin.REMOTE
              ? asApiPath(
                  `/${thumbnailUrl}?updatedAt=${(picture.media?.updatedAt ?? 'unknown') as string}`
                )
              : thumbnailUrl
          }
        />
        <div className='adornments'>
          {adornments?.map((adornment, index) =>
            'component' in adornment ? (
              // adornment is a CustomPicturePreviewAdornmentConfig
              <adornment.component
                key={index}
                context={adornmentContext}
                extraProps={adornment.extraProps}
              />
            ) : (
              <DefaultPicturePreviewAdornment
                key={index}
                config={adornment}
                context={adornmentContext}
              />
            )
          )}
        </div>
        <PictureStats picture={picture} hovered={hovered} />
      </div>
    </div>
  );
};

export default PicturePreview;

export interface DefaultPicturePreviewAdornmentConfig {
  position: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
  onClick: (picture: FlatPicture, event: MouseEvent<HTMLElement>) => void;
  icon: ((picture: FlatPicture) => JSX.Element) | JSX.Element;
  title?: string;
  onlyShowOnHover?: boolean;
}

export const DefaultPicturePreviewAdornment = ({
  config,
  context,
}: {
  config: DefaultPicturePreviewAdornmentConfig;
  context: PicturePreviewAdornmentContext;
}) => {
  return (
    <div
      className={`adornment ${config.position} ${
        config.onlyShowOnHover
          ? `transition-opacity ${context.hovered ? 'opacity-100' : 'opacity-0'}`
          : ''
      }`}
      title={config.title}
      onClick={event => {
        event.preventDefault();
        event.stopPropagation();
        config.onClick(context.picture, event);
      }}
    >
      {isFunction(config.icon) ? <>{config.icon(context.picture)}</> : <>{config.icon}</>}
    </div>
  );
};
