import {
  Event,
  FolderSpecial,
  QuestionAnswer,
  ThumbUpAlt,
  ThumbUpAltOutlined,
} from '@mui/icons-material';
import { History } from 'history';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { formatTimeStamp } from '../../../helpers/format-timestamp';
import { FlatPicture } from '../../../types/additionalFlatTypes';
import useLike from '../picture/sidebar/like-hooks';

type DailyPictureInfoProps = {
  picture: FlatPicture;
};

const DailyPictureInfo = ({ picture }: DailyPictureInfoProps) => {
  const { t } = useTranslation();
  const history: History = useHistory();
  const pictureDate = formatTimeStamp(picture.time_range_tag);
  const archive = picture.archive_tag;
  const commentsCount = picture.comments?.length ?? 0;
  const { likeCount, like, isLiked } = useLike(picture.id, picture.likes ?? 0);

  return (
    <div className='flex mt-auto flex-col'>
      <div className='flex gap-4 mt-4'>
        <div
          className='items-center flex gap-2 mb-0.5'
          title={t('common.like')}
          onClick={event => {
            event.stopPropagation();
            like(isLiked);
          }}
        >
          {isLiked ? (
            <ThumbUpAlt className='cursor-pointer !transition-transform !duration-100 hover:scale-110 scale-105' />
          ) : (
            <ThumbUpAltOutlined className='cursor-pointer !transition-transform !duration-100 hover:scale-110' />
          )}
          {likeCount}
        </div>
        {commentsCount > 0 && (
          <div className='items-center flex gap-2' title={t('common.comments')}>
            <QuestionAnswer />
            {commentsCount}
          </div>
        )}
      </div>
      <div className={'flex items-center gap-2'}>
        <Event /> {pictureDate}
      </div>
      {archive && (
        <div className={'flex item-center gap-2'}>
          <FolderSpecial />
          <a
            href={`/archives/${archive.id}`}
            onClick={event => {
              event.preventDefault();
              history.push(`/archives/${archive.id}`, {
                showBack: true,
              });
            }}
          >
            {archive.name}
          </a>
        </div>
      )}
    </div>
  );
};

export default DailyPictureInfo;
