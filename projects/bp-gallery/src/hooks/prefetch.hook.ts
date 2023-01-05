import { useEffect } from 'react';
import { useGetPictureInfoLazyQuery } from '../graphql/APIConnector';
import {
  getNextPictureId,
  getPreviousPictureId,
} from '../components/views/picture/helpers/next-prev-picture';

const usePrefetchPictureHook = (id: string, siblings?: string[]) => {
  const [previousQuery] = useGetPictureInfoLazyQuery();
  const [nextQuery] = useGetPictureInfoLazyQuery();

  useEffect(() => {
    if (siblings?.includes(id)) {
      const previousId = getPreviousPictureId(id, siblings);
      if (previousId) {
        previousQuery({
          variables: {
            pictureId: previousId,
          },
        });
      }
      const nextId = getNextPictureId(id, siblings);
      if (nextId) {
        nextQuery({
          variables: {
            pictureId: nextId,
          },
        });
      }
    }
  }, [id, siblings, previousQuery, nextQuery]);
};

export default usePrefetchPictureHook;
