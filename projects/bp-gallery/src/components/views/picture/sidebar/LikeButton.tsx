import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Button, Icon } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useLikeMutation } from '../../../../graphql/APIConnector';
import useLikes from '../../../../hooks/likes.hook';

const LikeButton = ({ pictureId, likeCount }: { pictureId: string; likeCount: number }) => {
  const { t } = useTranslation();

  const [likedPictures, setLikedPictures] = useLikes();

  const isLiked = useMemo(
    () => likedPictures.some((x: string) => x === pictureId),
    [likedPictures, pictureId]
  );

  const [cachedLikeCountWithoutMine, setCachedLikeCountWithoutMine] = useState<number>(0);

  // wrap in ref so that the useEffect below doesn't trigger on changes to the current value
  const currentLikeCountWithoutMine = useRef(0);
  useEffect(() => {
    currentLikeCountWithoutMine.current = likeCount - (isLiked ? 1 : 0);
  }, [likeCount, isLiked]);

  useEffect(() => {
    setCachedLikeCountWithoutMine(currentLikeCountWithoutMine.current);
  }, [pictureId]);

  const displayedLikeCount = cachedLikeCountWithoutMine + (isLiked ? 1 : 0);

  const [likeMutation] = useLikeMutation({
    variables: { pictureId: pictureId },
    refetchQueries: ['getPictureInfo'],
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

  return (
    <Button
      variant={'outlined'}
      className={'min-h-fit flex flex-row gap-1 place-items-center p-1 pointer-events-auto'}
      onClick={event => {
        event.stopPropagation();
        like(isLiked);
      }}
    >
      <div className={'flex flex-row place-items-center'}>
        {isLiked ? <Icon>favorite</Icon> : <Icon>favorite_border</Icon>}
        <div className={'text-sm m-0'}>{displayedLikeCount}</div>
        <div className={'w-2'} />
        {t('common.like')}
      </div>
    </Button>
  );
};

export default LikeButton;
