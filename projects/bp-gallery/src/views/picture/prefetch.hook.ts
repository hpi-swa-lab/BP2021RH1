import { useMemo } from 'react';
import { useGetPictureInfoLazyQuery } from '../../graphql/APIConnector';
import { getNextPictureId, getPreviousPictureId } from './helpers/next-prev-picture';

const usePrefetchPictureHook = (id: string, siblings?: string[]) => {
  const [siblingQuery] = useGetPictureInfoLazyQuery();
  const current = useGetPictureInfoLazyQuery();

  return useMemo(() => {
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
    return current;
  }, [id, siblings, current, siblingQuery]);
};

export default usePrefetchPictureHook;
