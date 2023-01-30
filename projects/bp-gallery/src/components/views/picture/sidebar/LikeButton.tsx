import React, { useEffect, useRef, useState } from 'react';
import { Button, Icon } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useLikeMutation } from '../../../../graphql/APIConnector';

const LikeButton = ({ pictureId, likeCount }: { pictureId: string; likeCount: number }) => {
  const { t } = useTranslation();

  if (!localStorage.getItem('likes')) localStorage.setItem('likes', JSON.stringify([]));

  const [likedPictures, setLikedPictures] = useState<string[]>(
    JSON.parse(localStorage.getItem('likes') ?? '[]') as string[]
  );

  const [isLiked, setIsLiked] = useState<boolean>(
    likedPictures.some((x: string) => x === pictureId)
  );

  const newLikeCount = useRef(likeCount);

  const [likeNumber, setLikeNumber] = useState<number>(likeCount);
  const [likeMutation] = useLikeMutation({
    variables: { pictureId: pictureId },
    refetchQueries: ['getPictureInfo'],
  });

  useEffect(
    () => setIsLiked(likedPictures.some(likedPicture => likedPicture === pictureId)),
    [pictureId, likedPictures]
  );
  useEffect(() => {
    newLikeCount.current = likeCount;
  }, [likeCount]);
  useEffect(() => setLikeNumber(newLikeCount.current), [pictureId]);

  const like = async (dislike: boolean) => {
    let likes;
    if (dislike) {
      likes = likedPictures.filter(likedPicture => likedPicture !== pictureId);
      setLikeNumber(likeNumber <= 0 ? 0 : likeNumber - 1);
      await likeMutation({ variables: { pictureId: pictureId, dislike: true } });
    } else {
      likes = [...likedPictures, pictureId];
      setLikeNumber(likeNumber + 1);
      await likeMutation();
    }
    setLikedPictures(likes);
    localStorage.setItem('likes', JSON.stringify(likes));
  };

  return (
    <Button
      variant={'outlined'}
      className={'min-h-fit flex flex-row gap-1 place-items-center p-1'}
      onClick={() => {
        like(isLiked);
        setIsLiked(like => !like);
      }}
    >
      <div className={'flex flex-row place-items-center'}>
        {isLiked ? <Icon>favorite</Icon> : <Icon>favorite_border</Icon>}
        <div className={'text-sm m-0'}>{likeNumber}</div>
        <div className={'w-2'} />
        {t('common.like')}
      </div>
    </Button>
  );
};

export default LikeButton;
