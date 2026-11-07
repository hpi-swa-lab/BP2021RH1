import { useEffect } from 'react';
import { PictureIds } from '../components/views/picture/PictureView';
import {
  getNextPictureId,
  getPreviousPictureId,
} from '../components/views/picture/helpers/next-prev-picture';
import { useGetPictureInfoLazyQuery } from '../graphql/APIConnector';
import { usePictureSidebarPermissions } from './can-do-hooks';

const usePrefetchPicture = (pictureId: string | undefined) => {
  const [getPictureInfo] = useGetPictureInfoLazyQuery();
  useEffect(() => {
    if (pictureId) {
      getPictureInfo({ variables: { pictureId } });
    }
  }, [pictureId, getPictureInfo]);
  usePictureSidebarPermissions(pictureId);
};

const usePrefetchPictureHook = (
  { pictureInSiblingsId, pictureInSequenceId }: PictureIds,
  siblings?: string[],
  pictureSequenceIds?: string[]
) => {
  usePrefetchPicture(getPreviousPictureId(pictureInSiblingsId, siblings));
  usePrefetchPicture(getNextPictureId(pictureInSiblingsId, siblings));
  usePrefetchPicture(getPreviousPictureId(pictureInSequenceId, pictureSequenceIds));
  usePrefetchPicture(getNextPictureId(pictureInSequenceId, pictureSequenceIds));
};

export default usePrefetchPictureHook;
