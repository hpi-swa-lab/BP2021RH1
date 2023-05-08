import { Card, CardActionArea, CardContent, CardMedia } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { asUploadPath } from '../../../helpers/app-helpers';
import { FlatPicture } from '../../../types/additionalFlatTypes';
import { useVisit } from './../../../helpers/history';
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
  archivePictureCount: number | undefined;
}) => {
  const pictureLink = asUploadPath(picture.media, { fallback: '/bad-harzburg-stiftung-logo.png' });

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
  archivePictureCount: number | undefined;
}) => {
  const { t } = useTranslation();
  const { visit } = useVisit();

  return (
    <Card onClick={() => visit(`/archives/${archiveId}`)}>
      <CardActionArea>
        <CardMedia component='img' height='140' image={pictureLink} alt='archive picture' />
        <CardContent
          style={{
            height: 'auto',
          }}
        >
          <h3>{archiveName}</h3>
          <p id='description'>{archiveDescription}</p>
          {archivePictureCount !== undefined && (
            <div className='text-right'>
              {t('common.pictureCount', {
                count: archivePictureCount,
              })}
            </div>
          )}
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
  archivePictureCount: number | undefined;
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
