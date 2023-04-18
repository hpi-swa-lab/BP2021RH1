import { FaceTag } from './FaceTag';
import { useFaceTagging } from '../../../../hooks/context-hooks';

export const FaceTags = () => {
  const faceTaggingContext = useFaceTagging();

  if (faceTaggingContext?.hideTags) {
    return null;
  }
  return (
    <>
      {faceTaggingContext?.tags.map(data => (
        <FaceTag data={data} key={data.name} />
      ))}
    </>
  );
};
