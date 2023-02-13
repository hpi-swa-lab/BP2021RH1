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
    editorRef.current = new TuiImageEditor(rootRef.current!, options);

    return () => {
      editorRef.current?.destroy();
    };
  }, [editorRef, options]);
  return <div ref={rootRef} />;
};

export default ImageEditor;
