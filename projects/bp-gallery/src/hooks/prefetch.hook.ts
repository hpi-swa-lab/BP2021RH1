import { useEffect } from 'react';
import { PictureIds } from '../components/views/picture/PictureView';
import {
  getNextPictureId,
  getPreviousPictureId,
} from '../components/views/picture/helpers/next-prev-picture';
import { useGetPictureInfoLazyQuery } from '../graphql/APIConnector';

const usePrefetchPictureHook = (
  { pictureInSiblingsId, pictureInSequenceId }: PictureIds,
  siblings?: string[],
  pictureSequenceIds?: string[]
) => {
  const [previousQuery] = useGetPictureInfoLazyQuery();
  const [nextQuery] = useGetPictureInfoLazyQuery();
  const [previousInSequenceQuery] = useGetPictureInfoLazyQuery();
  const [nextInSequenceQuery] = useGetPictureInfoLazyQuery();

  useEffect(() => {
    if (siblings?.includes(pictureInSiblingsId)) {
      const previousId = getPreviousPictureId(pictureInSiblingsId, siblings);
      if (previousId) {
        previousQuery({
          variables: {
            pictureId: previousId,
          },
        });
      }
      const nextId = getNextPictureId(pictureInSiblingsId, siblings);
      if (nextId) {
        nextQuery({
          variables: {
            pictureId: nextId,
          },
        });
      }
    }
    if (pictureSequenceIds?.includes(pictureInSequenceId)) {
      const previousId = getPreviousPictureId(pictureInSequenceId, pictureSequenceIds);
      if (previousId) {
        previousInSequenceQuery({
          variables: {
            pictureId: previousId,
          },
        });
      }
      const nextId = getNextPictureId(pictureInSequenceId, pictureSequenceIds);
      if (nextId) {
        nextInSequenceQuery({
          variables: {
            pictureId: nextId,
          },
        });
      }
    }
  }, [
    pictureInSiblingsId,
    siblings,
    previousQuery,
    nextQuery,
    pictureSequenceIds,
    pictureInSequenceId,
    previousInSequenceQuery,
    nextInSequenceQuery,
  ]);
};

export default usePrefetchPictureHook;
