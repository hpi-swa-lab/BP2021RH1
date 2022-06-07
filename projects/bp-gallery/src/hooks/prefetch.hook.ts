import { useEffect } from 'react';
import { useGetPictureInfoLazyQuery } from '../graphql/APIConnector';
import {
  getNextPictureId,
  getPreviousPictureId,
} from '../components/views/picture/helpers/next-prev-picture';

const usePrefetchPictureHook = (id: string, siblings?: string[]) => {
  const [siblingQuery] = useGetPictureInfoLazyQuery();

  useEffect(() => {
    if (siblings?.includes(id)) {
      const previousId = getPreviousPictureId(id, siblings);
      if (previousId) {
        siblingQuery({
          variables: {
            pictureId: previousId,
          },
        });
      }
      const nextId = getNextPictureId(id, siblings);
      if (nextId) {
        siblingQuery({
          variables: {
            pictureId: nextId,
          },
        });
      }
    }
  }, [id, siblings, siblingQuery]);
};

export default usePrefetchPictureHook;
