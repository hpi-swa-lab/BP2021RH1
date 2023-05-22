import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useLikeMutation } from '../../../../graphql/APIConnector';
import { useStorage } from '../../../../hooks/context-hooks';

const useLike = (pictureId: string, likeCount: number) => {
  const [likedPictures, setLikedPictures] = useStorage().likedState;

  const isLiked = useMemo(
    () => likedPictures.some((x: string) => x === pictureId),
    [likedPictures, pictureId]
  );

  const [cachedLikeCountWithoutMine, setCachedLikeCountWithoutMine] = useState<number>(0);

  // wrap in ref so that the useEffect below doesn't trigger on changes to the current value
  const currentLikeCountWithoutMine = useRef(0);
  useEffect(() => {
    currentLikeCountWithoutMine.current = likeCount > 0 ? likeCount - (isLiked ? 1 : 0) : 0;
  }, [likeCount, isLiked]);

  useEffect(() => {
    setCachedLikeCountWithoutMine(currentLikeCountWithoutMine.current);
  }, [pictureId]);

  const displayedLikeCount = cachedLikeCountWithoutMine + (isLiked ? 1 : 0);

  const [likeMutation] = useLikeMutation({
    variables: { pictureId: pictureId },
    refetchQueries: ['getPictureInfo', 'getMostLikedPictures'],
  });

  const like = useCallback(
    async (dislike: boolean) => {
      if (dislike) {
        setLikedPictures(likedPictures =>
          likedPictures.filter(likedPicture => likedPicture !== pictureId)
        );
        await likeMutation({ variables: { pictureId: pictureId, dislike: true } });
      } else {
        setLikedPictures(likedPictures => [...likedPictures, pictureId]);
        await likeMutation();
      }
    },
    [setLikedPictures, pictureId, likeMutation]
  );
  return { likeCount: displayedLikeCount, like, isLiked };
};

export default useLike;
