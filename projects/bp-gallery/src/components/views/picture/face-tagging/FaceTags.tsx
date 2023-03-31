import { FaceTag } from './FaceTag';
import { useFaceTagging } from '../../../../hooks/context-hooks';

export const FaceTags = () => {
  const FaceTaggingContext = useFaceTagging();

  if (!FaceTaggingContext || FaceTaggingContext.hideTags) {
    return null;
  }
  return (
    <>
      {FaceTaggingContext.tags.map(data => (
        <FaceTag data={data} key={data.name} />
      ))}
    </>
  );
};
