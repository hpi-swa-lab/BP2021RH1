import { FaceTag } from './FaceTag';
import { useFaceTagging } from '../../../../hooks/context-hooks';
import { useMemo } from 'react';

export const FaceTags = () => {
  const faceTaggingContext = useFaceTagging();
  const tags = useMemo(() => {
    return faceTaggingContext?.tags;
  }, [faceTaggingContext?.tags]);

  if (!tags || faceTaggingContext?.hideTags) {
    return null;
  }
  return (
    <>
      {tags.map(data => (
        <FaceTag data={data} key={data.name} />
      ))}
    </>
  );
};
