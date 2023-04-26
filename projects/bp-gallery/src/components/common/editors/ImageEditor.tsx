import { MutableRefObject, useEffect, useRef } from 'react';
import TuiImageEditor from 'tui-image-editor';
import 'tui-image-editor/dist/tui-image-editor.css';

type ImageEditorOptions = ConstructorParameters<typeof TuiImageEditor>[1];

const ImageEditor = ({
  editorRef,
  options,
}: {
  editorRef: MutableRefObject<TuiImageEditor | null>;
  options: ImageEditorOptions;
}) => {
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // There's currently a bug in the tui image editor where it always throws an unhandled rejection error upon loading an image. Since the image still loads and the error is in the tui image editor itself and therefore not fixable by us, I've decided to just ignore it until the package gets updated.
    const onUnhandledRejection = (event: PromiseRejectionEvent) => {
      if (event.reason instanceof TypeError && event.reason.message.includes('null')) {
        event.preventDefault();
        event.stopPropagation();
      }
    };
    window.addEventListener('unhandledrejection', onUnhandledRejection);
    editorRef.current = new TuiImageEditor(rootRef.current!, options);

    return () => {
      editorRef.current?.destroy();
      editorRef.current = null;
      window.removeEventListener('unhandledrejection', onUnhandledRejection);
    };
  }, [editorRef, options]);
  return <div ref={rootRef} />;
};

export default ImageEditor;
