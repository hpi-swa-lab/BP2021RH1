import { PictureAsPdf } from '@mui/icons-material';
import { MouseEventHandler, useEffect, useMemo, useRef, useState } from 'react';
import { Document, Thumbnail } from 'react-pdf';
import { PageCallback } from 'react-pdf/dist/cjs/shared/types';
import { PictureOrigin, asUploadPath } from '../../../helpers/app-helpers';
import { FlatPicture } from '../../../types/additionalFlatTypes';
import Loading from '../Loading';
import {
  DefaultPicturePreviewAdornment,
  PicturePreviewAdornment,
  PicturePreviewAdornmentContext,
} from './PicturePreview';
import PictureStats from './PictureStats';

type PdfPreviewProps = {
  picture: FlatPicture;
  onClick: MouseEventHandler<HTMLDivElement>;
  adornments?: PicturePreviewAdornment[];
  allowClicks?: boolean;
  pictureOrigin?: PictureOrigin;
};

const PdfPreview = ({
  picture,
  onClick,
  adornments,
  allowClicks = true,
  pictureOrigin,
}: PdfPreviewProps) => {
  const [page, setPage] = useState<PageCallback>();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const scale = (page?.originalWidth ?? 1) / (page?.originalHeight ?? 1);
  const [loading, setLoading] = useState(true);
  const [hovered, setHovered] = useState(false);

  const test = useRef<HTMLDivElement>(null);

  const width = useMemo(() => {
    if (!page?.originalWidth || !test.current?.clientWidth) return undefined;
    if (page.originalWidth > test.current.clientWidth) return test.current.clientWidth;
    return undefined;
  }, [page?.originalWidth]);

  const height = useMemo(() => {
    if (!page?.originalHeight || !test.current?.clientHeight) return undefined;
    if (page.originalHeight > test.current.clientHeight) return test.current.clientHeight;
    return undefined;
  }, [page?.originalHeight]);

  const resetCanvas = () => {
    if (!canvasRef.current) return;
    canvasRef.current.style.width = '100%';
    canvasRef.current.style.height = 'auto';
  };

  const adornmentContext: PicturePreviewAdornmentContext = useMemo(
    () => ({
      picture,
      hovered,
    }),
    [picture, hovered]
  );

  useEffect(() => {
    resetCanvas();
    setLoading(false);
  }, [page]);

  return (
    <div
      className={'preview-container relative'}
      onMouseOver={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      ref={test}
      onClick={onClick}
      style={{
        flex: `${String(scale)} 1 0`,
      }}
    >
      {/* {loading && (
        <div className='relative h-full'>
          <PictureAsPdf className='absolute !h-full !w-full opacity-30' />
          <Loading />
        </div>
      )} */}
      <div
        className={`picture-preview ${allowClicks ? 'allow-clicks' : ''}`}
        id={`picture-preview-for-${picture.id}`}
      >
        {/* https://stackoverflow.com/questions/728616/disable-cache-for-some-images */}
        <Document
          className={`flex ${loading ? 'hidden' : ''}`}
          file={asUploadPath(picture.media, { pictureOrigin })}
          loading={
            <div className='relative h-full'>
              <PictureAsPdf className='absolute !h-full !w-full opacity-30' />
              <Loading />
            </div>
          }
        >
          <Thumbnail
            pageIndex={0}
            width={width}
            height={height}
            onLoadSuccess={page => setPage(page)}
            canvasRef={canvasRef}
            onRenderSuccess={() => {
              resetCanvas();
            }}
          />
        </Document>
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

export default PdfPreview;
