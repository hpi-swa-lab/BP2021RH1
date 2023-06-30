import { ZoomIn, ZoomOut } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import { ceil, range, round, throttle } from 'lodash';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { DocumentCallback } from 'react-pdf/dist/cjs/shared/types';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import { asUploadPath } from '../../../helpers/app-helpers';
import { FlatPicture } from '../../../types/additionalFlatTypes';

type PDFViewerProps = {
  picture: FlatPicture;
};

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.js',
  import.meta.url
).toString();

const PDFViewer = ({ picture }: PDFViewerProps) => {
  const documentRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [numPages, setNumPages] = useState(0);
  const [height, setHeight] = useState<number>();
  const [width, setWidth] = useState<number>();
  const [selectOption, setSelectOption] = useState<number | 'fit' | 'width' | string>(100);
  const onDocumentLoadSuccess = (document: DocumentCallback) => {
    setNumPages(document.numPages);
  };

  const zoom = useMemo(() => Number(selectOption) || 100, [selectOption]);

  console.log('round', round(zoom / 100, 1));
  const zoomFactor = ceil(zoom / 100) * 10;
  const zoomOut = useCallback(
    () => setSelectOption(Math.max(10, zoom - zoomFactor)),
    [zoom, zoomFactor]
  );
  const zoomIn = useCallback(
    () => setSelectOption(Math.min(1000, zoom + zoomFactor)),
    [zoom, zoomFactor]
  );

  const pageFit = () => {
    if (!documentRef.current) return;
    setHeight(documentRef.current.clientHeight);
    setWidth(undefined);
  };

  const pageWidth = () => {
    if (!containerRef.current) return;
    setHeight(undefined);
    setWidth(containerRef.current.clientWidth);
  };

  useEffect(() => {
    if (!documentRef.current) return;
    const doc = documentRef.current;
    const onResize = () => {};

    const doZoom = throttle((ins: boolean) => {
      ins ? zoomIn() : zoomOut();
    }, 500);

    const onWheel = (event: WheelEvent) => {
      if (event.ctrlKey) {
        event.preventDefault();
        doZoom(event.deltaY > 0 ? false : true);
      }
    };
    doc.addEventListener('resize', onResize);
    doc.addEventListener('wheel', onWheel, { passive: false });

    return () => {
      doc.removeEventListener('resize', onResize);
      doc.removeEventListener('wheel', onWheel);
    };
  }, [zoomIn, zoomOut]);

  console.log(zoom);
  console.log('selectOption', selectOption);

  return (
    <div ref={containerRef} className='w-full h-full bg-inherit flex flex-col overflow-hidden'>
      <div className={`w-full h-10 bg-red-800 mt-14 flex items-center justify-center gap-2`}>
        <IconButton onClick={zoomOut}>
          <ZoomOut />
        </IconButton>
        <select
          value={selectOption}
          onChange={event => {
            console.log('event value', event.target.value);
            switch (event.target.value) {
              case 'fit':
                pageFit();
                break;
              case 'width':
                pageWidth();
                break;
              default:
                setWidth(undefined);
                setHeight(undefined);
                break;
            }
            setSelectOption(event.target.value);
          }}
        >
          <option value={'fit'}>Page Fit</option>
          <option value={'width'}>Page Width</option>
          {range(10, 1010, 10).map(value => (
            <option
              key={value}
              className={`${
                ![50, 75, 100, 125, 150, 200, 300, 400].includes(value) ? 'hidden' : ''
              }`}
              value={value}
            >{`${value}%`}</option>
          ))}
        </select>
        <IconButton onClick={zoomIn}>
          <ZoomIn />
        </IconButton>
      </div>
      <div className='overflow-auto pr-1 self-center max-w-full max-h-full' ref={documentRef}>
        <Document
          className={'flex flex-col gap-1 w-full'}
          file={asUploadPath(picture.media)}
          onLoadSuccess={onDocumentLoadSuccess}
        >
          {Array.from(Array(numPages).keys()).map(pageIndex => (
            <Page
              canvasBackground='black'
              width={width}
              height={height}
              scale={round(zoom / 100, 1)}
              key={pageIndex}
              pageIndex={pageIndex}
            />
          ))}
        </Document>
      </div>
    </div>
  );
};

export default PDFViewer;
