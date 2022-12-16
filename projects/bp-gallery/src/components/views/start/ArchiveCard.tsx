import React from 'react';
import { Card, CardActionArea, CardContent, CardMedia } from '@mui/material';
import { useHistory } from 'react-router-dom';
import { History } from 'history';
import { FlatPicture } from '../../../types/additionalFlatTypes';
import { useSimplifiedQueryResponseData } from '../../../graphql/queryUtils';
import { useGetPictureInfoQuery } from '../../../graphql/APIConnector';
import { asApiPath } from '../../App';
import './ArchiveCard.scss';

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
  const history: History = useHistory();
  const { data } = useGetPictureInfoQuery({ variables: { pictureId: pictureId } });
  const picture: FlatPicture | undefined = useSimplifiedQueryResponseData(data)?.picture;
  const pictureLink = picture?.media?.url
    ? asApiPath(`${picture.media.url}?updatedAt=${picture.media.updatedAt as string}`)
    : '';
  return (
    <Card onClick={() => history.push(`/archives/${archiveId}`)}>
      <CardActionArea>
        <CardMedia
          component='img'
          height='140'
          image={pictureId ? pictureLink : '/bad-harzburg-stiftung-logo.png'}
          alt='archive picture'
        />
        <CardContent>
          <h3>{archiveName}</h3>
          <p id='description'>{archiveDescription}</p>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default ArchiveCard;
