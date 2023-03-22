import { Card, CardActionArea, CardContent, CardMedia } from '@mui/material';
import { History } from 'history';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { asApiPath } from '../../../helpers/app-helpers';
import { FlatPicture } from '../../../types/additionalFlatTypes';
import './ArchiveCard.scss';

const ArchiveCard = ({
  picture,
  archiveName,
  archiveDescription,
  archiveId,
  archivePictureCount,
}: {
  picture: FlatPicture;
  archiveName: string;
  archiveDescription: string;
  archiveId: string;
  archivePictureCount: number;
}) => {
  const pictureLink = picture.media?.url
    ? asApiPath(`${picture.media.url}?updatedAt=${picture.media.updatedAt as string}`)
    : '/bad-harzburg-stiftung-logo.png';

  return (
    <CardLayout
      archiveId={archiveId}
      pictureLink={pictureLink}
      archiveName={archiveName}
      archiveDescription={archiveDescription}
      archivePictureCount={archivePictureCount}
    />
  );
};

const CardLayout = ({
  archiveId,
  pictureLink,
  archiveName,
  archiveDescription,
  archivePictureCount,
}: {
  archiveId: string;
  pictureLink: string;
  archiveName: string;
  archiveDescription: string;
  archivePictureCount: number;
}) => {
  const { t } = useTranslation();

  const history: History = useHistory();
  return (
    <Card
      onClick={() =>
        history.push(`/archives/${archiveId}`, {
          showBack: true,
        })
      }
    >
      <CardActionArea>
        <CardMedia component='img' height='140' image={pictureLink} alt='archive picture' />
        <CardContent
          style={{
            height: 'auto',
          }}
        >
          <h3>{archiveName}</h3>
          <p id='description'>{archiveDescription}</p>
          <div className='text-right'>
            {t('common.pictureCount', {
              count: archivePictureCount,
            })}
          </div>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

const ArchiveCardWithoutPicture = ({
  archiveName,
  archiveDescription,
  archiveId,
  archivePictureCount,
}: {
  archiveName: string;
  archiveDescription: string;
  archiveId: string;
  archivePictureCount: number;
}) => {
  return (
    <CardLayout
      archiveId={archiveId}
      pictureLink={'/bad-harzburg-stiftung-logo.png'}
      archiveName={archiveName}
      archiveDescription={archiveDescription}
      archivePictureCount={archivePictureCount}
    />
  );
};
export { ArchiveCard, ArchiveCardWithoutPicture };
