import { QuestionAnswer, ThumbUpAlt, ThumbUpAltOutlined } from '@mui/icons-material';
import { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatPicture } from '../../../types/additionalFlatTypes';
import { ShowStatsContext } from '../../provider/ShowStatsProvider';
import useLike from '../../views/picture/sidebar/like-hooks';

type PictureStatsProps = {
  picture: FlatPicture;
  hovered: boolean;
};

const PictureStats = ({ picture, hovered }: PictureStatsProps) => {
  const showStats = useContext(ShowStatsContext);
  const { t } = useTranslation();
  const { likeCount, like, isLiked } = useLike(picture.id, picture.likes ?? 0);
  const commentsCount = picture.comments?.length ?? 0;

  return showStats ? (
    <div className='absolute flex w-full justify-end bottom-0 transparent right-0 text-white brightness-100'>
      <div className={`h-20 w-full bg-gradient-to-t from-black `}></div>
      <div
        className={`absolute bottom-0 right-0 items-center flex gap-2 transparent mb-1 mr-2 transition-all duration-200 cursor-default ${
          hovered ? 'text-xl' : 'text-base'
        }`}
      >
        <div
          className='items-center flex'
          title={t('common.like')}
          onClick={event => {
            event.stopPropagation();
            like(isLiked);
          }}
        >
          {isLiked ? (
            <ThumbUpAlt
              fontSize='inherit'
              className='text-blue-400 cursor-pointer !transition-transform !duration-100 hover:scale-110 scale-105'
            />
          ) : (
            <ThumbUpAltOutlined
              fontSize='inherit'
              className='cursor-pointer !transition-transform !duration-100 hover:scale-110'
            />
          )}
          &nbsp;
          {likeCount}
        </div>

        {commentsCount > 0 && (
          <div className='items-center flex' title={t('common.comments')}>
            <QuestionAnswer fontSize='inherit' />
            &nbsp;
            {commentsCount}
          </div>
        )}
      </div>
    </div>
  ) : null;
};

export default PictureStats;