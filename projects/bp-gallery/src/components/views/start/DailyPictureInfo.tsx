import {
  Event,
  FolderSpecial,
  QuestionAnswer,
  ThumbUpAlt,
  ThumbUpAltOutlined,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { formatTimeStamp } from '../../../helpers/format-timestamp';
import { FlatPicture } from '../../../types/additionalFlatTypes';
import useLike from '../picture/sidebar/like-hooks';

type DailyPictureInfoProps = {
  picture: FlatPicture;
};

const DailyPictureInfo = ({ picture }: DailyPictureInfoProps) => {
  const { t } = useTranslation();
  const pictureDate = formatTimeStamp(picture.time_range_tag);
  const pictureArchive = picture.archive_tag?.name;
  const pictureArchiveId = picture.archive_tag?.id;
  const pictureArchiveLink = pictureArchiveId ? `/archives/${pictureArchiveId}` : '';
  const { likeCount, like, isLiked } = useLike(picture.id, picture.likes ?? 0);

  return (
    <div className='flex mt-auto flex-col'>
      <div className='flex gap-4'>
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
        {(picture.comments?.length ?? 0) > -1 && (
          <div className='items-center flex gap-2' title={t('common.comments')}>
            <QuestionAnswer />
            {picture.comments?.length ?? 0}
          </div>
        )}
      </div>
      <div className={'flex items-center gap-2'}>
        <Event /> {pictureDate}
      </div>
      <div className={'flex item-center gap-2'}>
        <FolderSpecial /> <a href={pictureArchiveLink}>{pictureArchive} </a>
      </div>
    </div>
  );
};

export default DailyPictureInfo;
