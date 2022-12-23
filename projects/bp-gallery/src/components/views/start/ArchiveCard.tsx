import React from 'react';
import { Card, CardActionArea, CardContent, CardMedia } from '@mui/material';
import { useHistory } from 'react-router-dom';
import { History } from 'history';
import './ArchiveCard.scss';
import { useSimplifiedQueryResponseData } from '../../../graphql/queryUtils';
import { FlatPicture } from '../../../types/additionalFlatTypes';
import { asApiPath } from '../../App';
import { useGetPictureInfoQuery } from '../../../graphql/APIConnector';

const ArchiveCard = ({
  pictureId,
  archiveName,
  archiveDescription,
  archiveId,
}: {
  pictureId: string;
  archiveName: string;
  archiveDescription: string;
  archiveId: string;
}) => {
  const { data } = useGetPictureInfoQuery({ variables: { pictureId: pictureId } });
  const picture: FlatPicture | undefined = useSimplifiedQueryResponseData(data)?.picture;
  const pictureLink = picture?.media?.url
    ? asApiPath(`${picture.media.url}?updatedAt=${picture.media.updatedAt as string}`)
    : '/bad-harzburg-stiftung-logo.png';

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
  const history: History = useHistory();
  return (
    <Card onClick={() => history.push(`/archives/${archiveId}`)}>
      <CardActionArea>
        <CardMedia component='img' height='140' image={pictureLink} alt='archive picture' />
        <CardContent>
          <h3>{archiveName}</h3>
          <p id='description'>{archiveDescription}</p>
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
