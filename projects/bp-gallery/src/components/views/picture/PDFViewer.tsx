import { useEffect, useRef, useState } from 'react';
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
  const [numPages, setNumPages] = useState(0);
  const [pageWidth, setPageWidth] = useState(0);
  const onDocumentLoadSuccess = (document: DocumentCallback) => {
    setNumPages(document.numPages);
  };

  useEffect(() => {
    if (!documentRef.current) return;
    const doc = documentRef.current;
    const onResize = () => {
      setPageWidth(doc.clientWidth);
    };
    doc.addEventListener('resize', onResize);

    return () => doc.removeEventListener('resize', onResize);
  }, []);

  return (
    <div className='overflow-y-auto' ref={documentRef}>
      <Document
        className={'flex flex-col gap-1 w-full'}
        file={asUploadPath(picture.media)}
        onLoadSuccess={onDocumentLoadSuccess}
      >
        {Array.from(Array(numPages).keys()).map(pageIndex => (
          <Page key={pageIndex} pageIndex={pageIndex} />
        ))}
      </Document>
    </div>
  );
};

export default PDFViewer;
