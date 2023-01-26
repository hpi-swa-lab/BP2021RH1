import React, { useEffect, useState } from 'react';
import { Button, Icon } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useLikeMutation } from '../../../../graphql/APIConnector';

const LikeButton = ({ pictureId, likeCount }: { pictureId: string; likeCount: number }) => {
  const { t } = useTranslation();

  if (!localStorage.getItem('likes')) localStorage.setItem('likes', JSON.stringify([]));
  const [likedPictures, setLikedPictures] = useState<string[]>(
    JSON.parse(localStorage.getItem('likes') || '[]')
  );

  const [isLiked, setIsLiked] = useState<boolean>(
    likedPictures.some((x: string) => x === pictureId)
  );
  const [likeNumber, setLikeNumber] = useState<number>(likeCount);
  const [likeMutation] = useLikeMutation();

  useEffect(
    () => setIsLiked(likedPictures.some((x: string) => x === pictureId)),
    [pictureId, likedPictures]
  );

  useEffect(() => setLikeNumber(likeCount), [pictureId, likeCount]);

  const like = async (dislike: boolean) => {
    let likes;
    if (dislike) {
      likes = likedPictures.filter((x: string) => x !== pictureId);
      setLikeNumber(likeNumber === 0 ? likeNumber : likeNumber - 1);
      await likeMutation({ variables: { pictureId: pictureId, dislike: true } });
    } else {
      likes = [...likedPictures, pictureId];
      setLikeNumber(likeNumber + 1);
      await likeMutation({ variables: { pictureId: pictureId, dislike: false } });
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
