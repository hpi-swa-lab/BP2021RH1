import { ThumbUpAlt, ThumbUpAltOutlined } from '@mui/icons-material';
import { Button } from '@mui/material';
import { useTranslation } from 'react-i18next';
import useLike from './like-hooks';

const LikeButton = ({ pictureId, likeCount }: { pictureId: string; likeCount: number }) => {
  const { t } = useTranslation();
  const { likeCount: displayedLikeCount, like, isLiked } = useLike(pictureId, likeCount);

  return (
    <Button
      variant={'outlined'}
      className='min-h-fit flex flex-row gap-1 place-items-center p-1 pointer-events-auto'
      onClick={event => {
        event.stopPropagation();
        like(isLiked);
      }}
    >
      <div className={`flex flex-row place-items-center gap-1`}>
        {isLiked ? <ThumbUpAlt className='scale-105' /> : <ThumbUpAltOutlined />}
        <div className={'mr-1'}>{displayedLikeCount}</div>
        {t('common.like')}
      </div>
    </Button>
  );
};

export default LikeButton;
