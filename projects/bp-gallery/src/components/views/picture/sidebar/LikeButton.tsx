import { Favorite, FavoriteBorder } from '@mui/icons-material';
import { Button } from '@mui/material';
import { useTranslation } from 'react-i18next';
import useLike from './like-hooks';

const LikeButton = ({
  pictureId,
  likeCount,
  className,
}: {
  pictureId: string;
  likeCount: number;
  className: string;
}) => {
  const { t } = useTranslation();
  const { likeCount: displayedLikeCount, like, isLiked } = useLike(pictureId, likeCount);

  return (
    <Button
      variant={'outlined'}
      className={className}
      onClick={event => {
        event.stopPropagation();
        like(isLiked);
      }}
    >
      <div className={'flex flex-row place-items-center'}>
        {isLiked ? <Favorite /> : <FavoriteBorder />}
        <div className={'text-sm m-0'}>{displayedLikeCount}</div>
        <div className={'w-2'} />
        {t('common.like')}
      </div>
    </Button>
  );
};

export default LikeButton;
