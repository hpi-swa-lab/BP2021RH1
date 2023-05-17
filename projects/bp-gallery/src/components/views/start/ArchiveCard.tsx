import { Card, CardActionArea, CardContent, CardMedia } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { asUploadPath } from '../../../helpers/app-helpers';
import { FlatPicture } from '../../../types/additionalFlatTypes';
import { useVisit } from './../../../helpers/history';
import './ArchiveCard.scss';
import ArchivePictureCount from './ArchivePictureCount';

const ArchiveCard = ({
  picture,
  archiveName,
  archiveDescription,
  archiveId,
}: {
  picture: FlatPicture;
  archiveName: string;
  archiveDescription: string;
  archiveId: string;
}) => {
  const pictureLink = asUploadPath(picture.media, { fallback: '/bad-harzburg-stiftung-logo.png' });

  return (
    <CardLayout
      archiveId={archiveId}
      pictureLink={pictureLink}
      archiveName={archiveName}
      archiveDescription={archiveDescription}
    />
  );
};

const CardLayout = ({
  archiveId,
  pictureLink,
  archiveName,
  archiveDescription,
}: {
  archiveId: string;
  pictureLink: string;
  archiveName: string;
  archiveDescription: string;
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
          <ArchivePictureCount archiveId={archiveId} />
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

const ArchiveCardWithoutPicture = ({
  archiveName,
  archiveDescription,
  archiveId,
}: {
  archiveName: string;
  archiveDescription: string;
  archiveId: string;
}) => {
  return (
    <CardLayout
      archiveId={archiveId}
      pictureLink={'/bad-harzburg-stiftung-logo.png'}
      archiveName={archiveName}
      archiveDescription={archiveDescription}
    />
  );
};
export { ArchiveCard, ArchiveCardWithoutPicture };
